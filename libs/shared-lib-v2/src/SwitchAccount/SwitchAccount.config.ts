import { RoleId } from '../utils/app.constant';

// Map of domain to allowed role IDs for Switch Account
const switchAccountConfig: Record<string, RoleId[]> = {
  'localhost:3001': [RoleId.TEACHER, RoleId.TEAM_LEADER, RoleId.MOBILIZER],
  'dev-lmp.prathamdigital.org': [RoleId.TEACHER, RoleId.TEAM_LEADER, RoleId.MOBILIZER],
  'qa-lmp.prathamdigital.org': [RoleId.TEACHER, RoleId.TEAM_LEADER, RoleId.MOBILIZER],
  'lmp.prathamdigital.org': [RoleId.TEACHER, RoleId.TEAM_LEADER, RoleId.MOBILIZER],
  'localhost:3002': [
    RoleId.ADMIN,
    RoleId.CENTRAL_LEAD,
    RoleId.SCTA,
    RoleId.CONTENT_CREATOR,
    RoleId.CONTENT_REVIEWER,
  ],
  'dev-lap.prathamdigital.org': [
    RoleId.ADMIN,
    RoleId.CENTRAL_LEAD,
    RoleId.SCTA,
    RoleId.CONTENT_CREATOR,
    RoleId.CONTENT_REVIEWER,
  ],
  'qa-lap.prathamdigital.org': [
    RoleId.ADMIN,
    RoleId.CENTRAL_LEAD,
    RoleId.SCTA,
    RoleId.CONTENT_CREATOR,
    RoleId.CONTENT_REVIEWER,
  ],
  'lap.prathamdigital.org': [
    RoleId.ADMIN,
    RoleId.CENTRAL_LEAD,
    RoleId.SCTA,
    RoleId.CONTENT_CREATOR,
    RoleId.CONTENT_REVIEWER,
  ],
  'localhost:3003': [RoleId.STUDENT],
  'dev-plp.prathamdigital.org': [RoleId.STUDENT],
  'qa-plp.prathamdigital.org': [RoleId.STUDENT],
  'plp.prathamdigital.org': [RoleId.STUDENT],
};

export default switchAccountConfig;
