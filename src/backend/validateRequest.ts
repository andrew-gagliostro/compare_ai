import safeObject from './safeObject';

interface Valid<T> {
  valid: true
  safeBody: T
}

interface Invalid {
  valid: false
  missing: string[]
}

function validateRequest<T>(body: any, required: string[]): Valid<T> | Invalid {
  const bodyKeys = Object.keys(body);
  const missing = required.filter((prop) => !bodyKeys.includes(prop) || body[prop] === (null || undefined || ''));

  if (missing.length) {
    return {
      valid: false,
      missing,
    };
  }

  return {
    valid: true,
    safeBody: safeObject(body, required),
  };
}

export default validateRequest;
