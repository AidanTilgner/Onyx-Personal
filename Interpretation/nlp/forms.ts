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
        missing: [],
        has_custom_entities: false,
        expected_entities: [],
      };
    }
    const found = entities
      .map((en) => {
        return {
          ...expected_entities.find((ee) => ee.type === en.entity),
          option: en.option,
        };
      })
      .filter((en) => en);
    const missing = expected_entities.filter((ee) => {
      return !entities.find((en) => ee.type === en.entity);
    });

    return {
      found: [...found],
      missing: [...missing],
      has_custom_entities: !!missing.length || !!found.length,
      expected_entities: expected_entities,
    };
  } catch (err) {
    console.log("Error getting action expected entities");
    return {
      error: err,
      has_custom_entities: false,
      found: [],
      missing: [],
      expected_entities: [],
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
): Promise<{
  opens_form: boolean;
  form?: {
    name: string;
    fields: Question[];
    action: string;
    complete: boolean;
  };
  error?: any;
  custom_entities?: {
    found: {
      type: string;
      custom_query: string;
      option: string;
    }[];
    missing: {
      type: string;
      custom_query: string;
    }[];
    expected_entities: {
      type: string;
      custom_query: string;
    }[];
    has_custom_entities: boolean;
  };
}> => {
  const currentForm = openQuestions[session_id]?.forms.find(
    (form) => form.action === action
  );
  if (currentForm) {
    return {
      opens_form: true,
      form: currentForm,
    };
  }

  const response = await getActionExpectedEntities(action, entities);
  if (response.error) {
    return {
      opens_form: false,
      error: response.error,
    };
  }
  const { missing, has_custom_entities, expected_entities, found } = response;

  if (has_custom_entities && missing.length > 0) {
    const form = {
      name: action,
      fields: expected_entities.map((m) => {
        return {
          entity: m.type,
          custom_query: m.custom_query,
          complete: found.find((f) => f.type === m.type) ? true : false,
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
      opens_form: true,
      form: form,
      custom_entities: {
        found: found,
        missing: missing,
        expected_entities: expected_entities,
        has_custom_entities: has_custom_entities,
      },
    };
  }

  return {
    opens_form: false,
    custom_entities: {
      found: found,
      missing: missing,
      expected_entities: expected_entities,
      has_custom_entities: has_custom_entities,
    },
  };
};

export const checkCompletesFields = (
  session_id: string,
  entities: {
    entity: string;
    option: string;
  }[]
) => {
  const actions: string[] = [];

  const forms = openQuestions[session_id]?.forms;
  if (!forms) {
    return {
      actions: actions,
    };
  }

  for (const form of forms) {
    let complete = true;
    for (const field of form.fields) {
      const entity = entities.find((en) => en.entity === field.entity);
      if (entity) {
        field.complete = true;
        field.value = entity.option;
      }
      if (!field.complete) {
        complete = false;
      }
    }
    form.complete = complete;
    if (complete) {
      actions.push(form.action);
      filterCompletedForms(session_id);
    }
  }
  return { actions };
};

export const filterCompletedForms = (session_id: string) => {
  const forms = openQuestions[session_id]?.forms;
  if (!forms) {
    return;
  }
  openQuestions[session_id].forms = forms.filter((form) => !form.complete);
};

export const getFieldsForForm = (session_id: string, name: string) => {
  return openQuestions[session_id].forms.find((f) => f.name === name).fields;
};

export const getSessionQuestions = (session_id: string) => {
  const custom_queries: string[] = [];

  const forms = openQuestions[session_id]?.forms;

  if (!forms) {
    return {
      custom_queries: [],
    };
  }

  for (const form of forms) {
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
