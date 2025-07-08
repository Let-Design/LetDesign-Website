export const ErrorMessages = {
  required: 'This field is required',
  email: 'Enter a valid email',
  minlength: ({ requiredLength }: { requiredLength: string }) =>
    `Min Length - ${requiredLength}`,
};
