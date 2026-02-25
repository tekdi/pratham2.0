import { SendCredentialsRequest } from '../Interfaces';

export type ProgramMappingEmailRequestInput = {
  email: string;
  firstName: string;
  role: string;
  program: string;
  platform: string;
  loginLink: string;
};

export function buildProgramMappingEmailRequest(
  input: ProgramMappingEmailRequestInput
): SendCredentialsRequest {
  return {
    isQueue: false,
    context: 'USER',
    key: 'programMapping',
    replacements: {
      '{role}': input.role,
      '{FirstName}': input.firstName,
      '{program}': input.program,
      '{platform}': input.platform,
      '{loginLink}': input.loginLink,
    },
    email: {
      receipients: [input.email],
    },
  };
}

