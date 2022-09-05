import { actionServer } from "../utils/axios";

interface Question {
  entity: string;
  custom_query: string;
  complete: boolean;
  value: string;
}

interface OpenQuestions {
  [session_id: string]: {
    forms: {
      name: string;
      fields: Question[];
      action: string;
      complete: boolean;
    }[];
  };
}

const openQuestions: OpenQuestions = {};

export const getActionExpectedEntities = async (
  act: string,
  entities: {
    entity: string;
    option: string;
  }[]
) => {
  try {
    const { data } = await actionServer.get(`/actions/metadata/${act}`);
    if (data.error) {
      return {
        found: [],
        not_found: [],
        has_custom_entities: false,
      };
    }
    const {
      response: { expected_entities },
    } = data as {
      response: {
        expected_entities: { type: string; custom_query: string }[];
      };
    };
    if (!expected_entities) {
      return {
        found: [],
        not_found: [],
        has_custom_entities: false,
      };
    }
    const found = entities.map((en) => {
      return expected_entities.find((ee) => ee.type === en.entity);
    });
    const missing = expected_entities.filter((ee) => {
      return !entities.find((en) => ee.type === en.entity);
    });

    return {
      found,
      missing,
      has_custom_entities: missing.some((m) => m.custom_query),
      expected_entities: expected_entities,
    };
  } catch (err) {
    console.log("Error getting action expected entities: ", err);
    return {
      error: err,
    };
  }
};

export const checkOpensFormAndOpenIfNecessary = async (
  session_id: string,
  action: string,
  entities: {
    entity: string;
    option: string;
  }[]
) => {
  const currentForm = openQuestions[session_id]?.forms.find(
    (form) => form.action === action
  );
  if (currentForm) {
    return {
      open: true,
      form: currentForm,
    };
  }

  const response = await getActionExpectedEntities(action, entities);
  if (response.error) {
    return {
      open: false,
      error: response.error,
    };
  }
  console.log("Expected entities: ", response);
  const { missing, has_custom_entities, expected_entities, found } = response;

  if (has_custom_entities && missing.length > 0) {
    const form = {
      name: action,
      fields: expected_entities.map((m) => {
        return {
          entity: m.type,
          custom_query: m.custom_query,
          complete: found.includes(m),
          value: found.find((f) => f.type === m.type)?.option || "",
        };
      }),
      action: action,
      complete: false,
    };
    if (!openQuestions[session_id]) {
      openQuestions[session_id] = {
        forms: [],
      };
    }
    openQuestions[session_id].forms.push(form);
    return {
      open: true,
      form: form,
    };
  }

  return {
    open: false,
    custom_entities: has_custom_entities ? found : [],
  };
};

const checkCompletesFields = (
  session_id: string,
  entities: {
    entity: string;
    option: string;
  }[]
) => {
  for (const form of openQuestions[session_id].forms) {
    for (const field of form.fields) {
      const entity = entities.find((en) => en.entity === field.entity);
      if (entity) {
        field.complete = true;
        field.value = entity.option;
      }
    }
  }
};

export const getFieldsForForm = (session_id: string, name: string) => {
  return openQuestions[session_id].forms.find((f) => f.name === name).fields;
};

export const getSessionQuestions = (session_id: string) => {
  const custom_queries: string[] = [];

  for (const form of openQuestions[session_id].forms) {
    for (const field of form.fields) {
      if (!field.complete) {
        custom_queries.push(field.custom_query);
      }
    }
  }

  return {
    custom_queries,
  };
};
