// ============================================================
// FRAMEWORK CONFIG
// Pratham 2.0 — Workspace MFE
//
// Defines:
//   • Framework-specific metadata columns for Content / QS / Course sheets
//   • All dropdown lookup values used in the Excel template
//   • Column → API field name mapping (used by parser)
// ============================================================

export type FrameworkId = 'pos-framework' | 'scp-framework';

// ─── Lookup Values ────────────────────────────────────────────

export const LOOKUP = {
  // ── Shared ──────────────────────────────────────────────────
  FILE_TYPES: ['pdf', 'zip', 'mp4', 'h5p'],
  QUESTION_TYPES: ['MCQ', 'Arrange', 'Match', 'Subjective'],
  CHILD_TYPES: ['content', 'questionset'],
  FRAMEWORKS: ['pos-framework', 'scp-framework'],
  LICENSES: ['CC BY 4.0', 'CC BY-SA 4.0', 'CC BY-NC 4.0', 'All Rights Reserved'],
  AUDIENCES: ['Student', 'Teacher', 'Parent', 'Administrator'],
  BLOOMS_LEVELS: ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'],
  DIFFICULTY_LEVELS: ['Easy', 'Medium', 'Hard'],
  EVALUATION_TYPES: ['online', 'offline', 'ai'],
  ASSESSMENT_TYPES: ['Pre Test', 'Post Test', 'Other', 'Unit Test', 'Mock Test', 'Eligibility Test'],

  // ── Languages ───────────────────────────────────────────────
  LANGUAGES: [
    'English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada',
    'Bengali', 'Gujarati', 'Odia', 'Punjabi', 'Sanskrit', 'Urdu',
    'Assamese', 'Malayalam', 'Kashmiri',
  ],

  // Content Language — single-select string field (contentLanguage), from content form-read API
  CONTENT_LANGUAGES: [
    'English', 'Marathi', 'Hindi', 'Assamese', 'Bengali', 'Gujarati',
    'Kannada', 'Kashmiri', 'Khasi', 'Malayalam', 'Manipuri', 'Odia',
    'Punjabi', 'Rabha (Rongdani)', 'Sanskrit', 'Tamil', 'Telugu', 'Urdu',
  ],

  // ── POS Framework ───────────────────────────────────────────
  // Sourced from pos-framework taxonomy read API (Live terms only)

  // 3 top-level domains from pos-framework API
  POS_DOMAINS: [
    'Learning for School',
    'Learning for Work',
    'Learning for Life',
  ],

  // 12 sub-domain terms from pos-framework API (Live terms only)
  POS_SUB_DOMAINS: [
    'Academics',
    'Career Exploration',
    'Creative Arts',
    'Employee Training',
    'Environment Education',
    'Growth & Learning',
    'Health & Wellbeing',
    'Inclusive Education',
    'Inclusive Learning',
    'Media Moments',
    'New Age Skills',
    'Sports',
  ],

  // Full subject list from pos-framework API (Live terms only, sorted alphabetically)
  POS_SUBJECTS: [
    'Activity Videos',
    'Agriculture Education',
    'Apparel',
    'Art & Culture',
    'Assamese',
    'Automotive',
    'Awareness & Advocacy',
    'Beauty',
    'Bengali',
    'Biodiversity & Conservation',
    'Career Awareness',
    'Climate Education',
    'Computational Thinking',
    'Construction',
    'Crafts & Design',
    'Daily-living & Independence',
    'Data Computing/Data Entry',
    'Data, Monitoring & Evaluation',
    'Digital Games',
    'Digital Skill Building',
    'Early Learning & School Readiness',
    'Electrical',
    'English',
    'Essential Awareness',
    'Everyday Skills',
    'Finance & Accounts',
    'Games',
    'General Health Awareness',
    'General Skills',
    'General/Other',
    'Good Contractor Program',
    'Gujarati',
    'HR',
    'Healthcare',
    'Hindi',
    'Holistic Development',
    'Home Science',
    'Hospitality & Tourism',
    'Indian Culture & History',
    'Individual Sports',
    'Innovative Strategies',
    'ITES',
    'Job Readiness',
    'Kannada',
    'Khasi',
    'Knowledge Videos',
    'Leadership',
    'Malayalam',
    'Marathi',
    'Math',
    'Media & Graphics',
    'Mental Health',
    'Natural Resources',
    'Odia',
    'Operational Management',
    'Painting',
    'Partnerships & External Engagement',
    'Performing Arts',
    'Physical Health',
    'Planning & Strategy',
    'Podcasts',
    'Program & Pedagogy',
    'Program Communication',
    'Punjabi',
    'Rabha (Rongdani)',
    'Rhymes & Lullabies',
    'Riddles',
    'School Readiness',
    'Science',
    'Social Science',
    'Social Studies',
    'Spoken English',
    'Stories',
    'Subject Specific Learning',
    'Sustainable Living',
    'Tamil',
    'Team Games',
    'Technical Skills',
    'Tech for Environment',
    'Telugu',
    'Therapy & Rehabilitation',
    'Training & Capacity Building',
    'TV Episodes',
    'Urdu',
    'Visual Arts',
    'Waterworks Management & Sanitation',
    'Welding',
    'Yoga',
  ],

  POS_GRADE_LEVELS: [
    'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
    'Grade 11', 'Grade 12',
  ],

  // From content form-read API (range values for medium field)
  POS_MEDIUMS: ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali'],

  // From content form-read API (range values for targetAgeGroup field)
  POS_TARGET_AGE_GROUPS: [
    '0-3 yrs', '3-6 yrs', '6-8 yrs', '8-11 yrs', '11-14 yrs', '14-18 yrs', '18 yrs +',
  ],

  // From content form-read API (range values for primaryUser field)
  POS_PRIMARY_USERS: ['Parents/Care givers', 'Educators', 'Learners/Children'],

  POS_PRIMARY_CATEGORIES_CONTENT: [
    'Learning Resource',
    'Explanation Content',
    'Teacher Resource',
    'Story',
    'Activity',
    'Interactive',
    'eTextbook',
  ],

  POS_PRIMARY_CATEGORIES_QS: ['Practice Question Set', 'Course Assessment', 'Exam Question'],

  // From content form-read API (range values for program field)
  POS_PROGRAMS: [
    'Hamara Gaon',
    'Early Childhood Education',
    'Inclusive Education (ENABLE)',
    'Elementary',
    'Second Chance',
    'Digital Initiatives',
    'Vocational Training',
    'Pratham Council For Vulnerable Children',
    'Annual Status of Education Report',
    'Pragyanpath',
    'Open School',
    'Experimento India',
    'Camp to Club',
    'Creativity Club',
    'Education for Education',
  ],

  // ── SCP Framework ───────────────────────────────────────────
  // SCP board terms from scp-framework read API (Live terms only; Retired terms excluded)
  SCP_BOARDS: [
    'BBOSE',
    'Maharashtra State Education Board',
    'Bihar State Board',
    'Bihar Board',
    'Karnataka State Education Board',
    'Tamil Nadu State Board',
    'Telangana Open School Society',
    'Andhra Pradesh Open School Society',
    'Gujarat State Open School',
    'Rajasthan State Open School',
    'Chhattisgarh State Open Board',
    'MP State Open School',
    'Odisha Board of Secondary Education',
    'NIOS - UP',
    'NIOS - Bihar',
    'NIOS - MP',
    'NIOS - Gujarat',
    'Co-Curricular',
  ],

  // SCP medium terms from scp-framework read API (Live terms only; Bengali & English are NOT in SCP)
  SCP_MEDIUMS: ['Marathi', 'Telugu', 'Kannada', 'Odia', 'Tamil', 'Urdu', 'Hindi', 'Gujarati'],

  // SCP framework only has Grade 10 as a Live gradeLevel term
  SCP_GRADE_LEVELS: ['Grade 10'],

  // SCP subject terms from scp-framework read API (Live terms only)
  SCP_SUBJECTS: [
    'Telugu',
    'Painting',
    'General/Other',
    'Hindi',
    'English',
    'Yoga',
    'Home Science',
    'Beyond Classroom',
    'Odia',
    'Kannada',
    'Urdu',
    'Math',
    'Gujarati',
    'Tamil',
    'Data Computing/Data Entry',
    'Marathi',
    'Science',
    'Social Studies',
    'Social Science',
    'Indian Culture & History',
    'Sanskrit',
    'Business Studies',
  ],

  // SCP courseType terms from scp-framework read API (Live terms only)
  SCP_COURSE_TYPES: ['Foundation Course', 'Main Course', 'Exam Prep', 'Enablers'],

  SCP_PRIMARY_CATEGORIES_CONTENT: [
    'Learning Resource',
    'Explanation Content',
    'Teacher Resource',
    'Study Material',
  ],

  SCP_PRIMARY_CATEGORIES_QS: ['Practice Question Set', 'Course Assessment'],

  SCP_PROGRAMS: ['Second Chance', 'Open School'],
} as const;

// ─── POS Identifier Maps ──────────────────────────────────────
// Maps display name (shown in Excel dropdown) → platform identifier
// Required because POS course form-read uses targetDomainIds / targetSubDomainIds /
// targetSubjectIds with output:"identifier" — same pattern as SCP.

export const POS_DOMAIN_NAME_TO_ID: Record<string, string> = {
  'Learning for School': 'pos-framework_domain_learningforschool',
  'Learning for Work':   'pos-framework_domain_learningforwork',
  'Learning for Life':   'pos-framework_domain_learningforlife',
};

export const POS_SUB_DOMAIN_NAME_TO_ID: Record<string, string> = {
  'Academics':             'pos-framework_subdomain_academics',
  'Career Exploration':    'pos-framework_subdomain_careerexploration',
  'Creative Arts':         'pos-framework_subdomain_creativearts',
  'Employee Training':     'pos-framework_subdomain_employeetraining',
  'Environment Education': 'pos-framework_subdomain_environmenteducation',
  'Growth & Learning':     'pos-framework_subdomain_growthplayfullearning',
  'Health & Wellbeing':    'pos-framework_subdomain_healthwellbeing',
  'Inclusive Education':   'pos-framework_subdomain_inclusiveeducation',
  'Inclusive Learning':    'pos-framework_subdomain_inclusivelearning',
  'Media Moments':         'pos-framework_subdomain_mediamoments',
  'New Age Skills':        'pos-framework_subdomain_newageskills',
  'Sports':                'pos-framework_subdomain_sports',
};

export const POS_SUBJECT_NAME_TO_ID: Record<string, string> = {
  'Activity Videos':                    'pos-framework_subject_activityvideos',
  'Agriculture Education':              'pos-framework_subject_agricultureeducation',
  'Apparel':                            'pos-framework_subject_apparel',
  'Art & Culture':                      'pos-framework_subject_artandculture',
  'Assamese':                           'pos-framework_subject_assamese',
  'Automotive':                         'pos-framework_subject_automotive',
  'Awareness & Advocacy':               'pos-framework_subject_awarenessandadvocacy',
  'Beauty':                             'pos-framework_subject_beauty',
  'Bengali':                            'pos-framework_subject_bengali',
  'Biodiversity & Conservation':        'pos-framework_subject_biodiversityandconservation',
  'Career Awareness':                   'pos-framework_subject_careerawareness',
  'Climate Education':                  'pos-framework_subject_climateeducation',
  'Computational Thinking':             'pos-framework_subject_computationalthinking',
  'Construction':                       'pos-framework_subject_construction',
  'Crafts & Design':                    'pos-framework_subject_craftsanddesign',
  'Daily-living & Independence':        'pos-framework_subject_dailylivingandindependence',
  'Data Computing/Data Entry':          'pos-framework_subject_datacomputingdataentry',
  'Data, Monitoring & Evaluation':      'pos-framework_subject_datamonitoringevaluation',
  'Digital Games':                      'pos-framework_subject_digitalgames',
  'Digital Skill Building':             'pos-framework_subject_digitalskillbuilding',
  'Early Learning & School Readiness':  'pos-framework_subject_earlylearningandschoolreadiness',
  'Electrical':                         'pos-framework_subject_electrical',
  'English':                            'pos-framework_subject_english',
  'Essential Awareness':                'pos-framework_subject_essentialawareness',
  'Everyday Skills':                    'pos-framework_subject_everydayskills',
  'Finance & Accounts':                 'pos-framework_subject_financeandaccounts',
  'Games':                              'pos-framework_subject_games',
  'General Health Awareness':           'pos-framework_subject_generalhealthawareness',
  'General Skills':                     'pos-framework_subject_generalskills',
  'General/Other':                      'pos-framework_subject_generalother',
  'Good Contractor Program':            'pos-framework_subject_goodcontractorprogram',
  'Gujarati':                           'pos-framework_subject_gujarati',
  'HR':                                 'pos-framework_subject_hr',
  'Healthcare':                         'pos-framework_subject_healthcare',
  'Hindi':                              'pos-framework_subject_hindi',
  'Holistic Development':               'pos-framework_subject_holisticdevelopment',
  'Home Science':                       'pos-framework_subject_homescience',
  'Hospitality & Tourism':              'pos-framework_subject_hospitalityandtourism',
  'Indian Culture & History':           'pos-framework_subject_indiancultureandhistory',
  'Individual Sports':                  'pos-framework_subject_individualsports',
  'Innovative Strategies':              'pos-framework_subject_innovativestrategies',
  'ITES':                               'pos-framework_subject_ites',
  'Job Readiness':                      'pos-framework_subject_jobreadiness',
  'Kannada':                            'pos-framework_subject_kannada',
  'Khasi':                              'pos-framework_subject_khasi',
  'Knowledge Videos':                   'pos-framework_subject_knowledgevideos',
  'Leadership':                         'pos-framework_subject_leadership',
  'Malayalam':                          'pos-framework_subject_malayalam',
  'Marathi':                            'pos-framework_subject_marathi',
  'Math':                               'pos-framework_subject_math',
  'Media & Graphics':                   'pos-framework_subject_mediaandgraphics',
  'Mental Health':                      'pos-framework_subject_mentalhealth',
  'Natural Resources':                  'pos-framework_subject_naturalresources',
  'Odia':                               'pos-framework_subject_odia',
  'Operational Management':             'pos-framework_subject_operationalmanagement',
  'Painting':                           'pos-framework_subject_painting',
  'Partnerships & External Engagement': 'pos-framework_subject_partnershipsandexternalengagement',
  'Performing Arts':                    'pos-framework_subject_performingarts',
  'Physical Health':                    'pos-framework_subject_physicalhealth',
  'Planning & Strategy':                'pos-framework_subject_planningstrategy',
  'Podcasts':                           'pos-framework_subject_podcasts',
  'Program & Pedagogy':                 'pos-framework_subject_programandpedagogy',
  'Program Communication':              'pos-framework_subject_programcommunication',
  'Punjabi':                            'pos-framework_subject_punjabi',
  'Rabha (Rongdani)':                   'pos-framework_subject_rabha',
  'Rhymes & Lullabies':                 'pos-framework_subject_rhymesandlullabies',
  'Riddles':                            'pos-framework_subject_riddles',
  'School Readiness':                   'pos-framework_subject_schoolreadiness',
  'Science':                            'pos-framework_subject_science',
  'Social Science':                     'pos-framework_subject_socialscience',
  'Social Studies':                     'pos-framework_subject_socialstudies',
  'Spoken English':                     'pos-framework_subject_spokenenglish',
  'Stories':                            'pos-framework_subject_stories',
  'Subject Specific Learning':          'pos-framework_subject_subjectspecificlearning',
  'Sustainable Living':                 'pos-framework_subject_sustainableliving',
  'Tamil':                              'pos-framework_subject_tamil',
  'Team Games':                         'pos-framework_subject_teamgames',
  'Technical Skills':                   'pos-framework_subject_technicalskills',
  'Tech for Environment':               'pos-framework_subject_techforenvironment',
  'Telugu':                             'pos-framework_subject_telugu',
  'Therapy & Rehabilitation':           'pos-framework_subject_therapyandrehabilitation',
  'Training & Capacity Building':       'pos-framework_subject_trainingandcapacitybuilding',
  'TV Episodes':                        'pos-framework_subject_tvepisodes',
  'Urdu':                               'pos-framework_subject_urdu',
  'Visual Arts':                        'pos-framework_subject_visualarts',
  'Waterworks Management & Sanitation': 'pos-framework_subject_waterworksmanagementandsanitation',
  'Welding':                            'pos-framework_subject_welding',
  'Yoga':                               'pos-framework_subject_yoga',
};

// ─── SCP Identifier Maps ──────────────────────────────────────
// Maps display name (shown in Excel dropdown) → platform identifier
// Required because SCP course form-read uses target*Ids fields with output:"identifier"

export const SCP_BOARD_NAME_TO_ID: Record<string, string> = {
  'Andhra Pradesh Open School Society': 'scp-framework_board_andhrapradeshopenschoolsociety',
  'Chhattisgarh State Open Board':      'scp-framework_board_chattisgarhstateopenboard',
  'Karnataka State Education Board':    'scp-framework_board_karnatakastateeducationboard',
  'Maharashtra State Education Board':  'scp-framework_board_maharashtraeducationboard',
  'MP State Open School':               'scp-framework_board_mpstateopenschool',
  'Odisha Board of Secondary Education':'scp-framework_board_odishaboardofsecondaryeducation',
  'Rajasthan State Open School':        'scp-framework_board_rajasthanstateopenschool',
  'Tamil Nadu State Board':             'scp-framework_board_tamilnadustateboard',
  'Telangana Open School Society':      'scp-framework_board_telanganaopenschoolsociety',
  'NIOS - Bihar':                       'scp-framework_board_niosbihar',
  'NIOS - Gujarat':                     'scp-framework_board_niosgujarat',
  'NIOS - MP':                          'scp-framework_board_niosmp',
  'NIOS - UP':                          'scp-framework_board_niosup',
  'BBOSE':                              'scp-framework_board_bbose',
  'Bihar State Board':                  'scp-framework_board_biharstateboard',
  'Gujarat State Open School':          'scp-framework_board_gujaratsos',
  'Bihar Board':                        'scp-framework_board_bihar-board',
  'Co-Curricular':                      'scp-framework_board_cocurricular',
};

export const SCP_MEDIUM_NAME_TO_ID: Record<string, string> = {
  'Marathi':  'scp-framework_medium_marathi',
  'Telugu':   'scp-framework_medium_telugu',
  'Kannada':  'scp-framework_medium_kannada',
  'Odia':     'scp-framework_medium_odia',
  'Tamil':    'scp-framework_medium_tamil',
  'Urdu':     'scp-framework_medium_urdu',
  'Hindi':    'scp-framework_medium_hindi',
  'Gujarati': 'scp-framework_medium_gujarati',
};

export const SCP_GRADE_NAME_TO_ID: Record<string, string> = {
  'Grade 10': 'scp-framework_gradelevel_grade10',
};

export const SCP_SUBJECT_NAME_TO_ID: Record<string, string> = {
  'Telugu':                    'scp-framework_subject_telugu',
  'Painting':                  'scp-framework_subject_painting',
  'General/Other':             'scp-framework_subject_general-other',
  'Hindi':                     'scp-framework_subject_hindi',
  'English':                   'scp-framework_subject_english',
  'Yoga':                      'scp-framework_subject_yoga',
  'Home Science':              'scp-framework_subject_homescience',
  'Beyond Classroom':          'scp-framework_subject_beyond-classroom',
  'Odia':                      'scp-framework_subject_odia',
  'Kannada':                   'scp-framework_subject_kannada',
  'Urdu':                      'scp-framework_subject_urdu',
  'Math':                      'scp-framework_subject_math',
  'Gujarati':                  'scp-framework_subject_gujarati',
  'Tamil':                     'scp-framework_subject_tamil',
  'Data Computing/Data Entry': 'scp-framework_subject_data-computing-data-entry',
  'Marathi':                   'scp-framework_subject_marathi',
  'Science':                   'scp-framework_subject_science',
  'Social Studies':            'scp-framework_subject_socialstudies',
  'Social Science':            'scp-framework_subject_socialscience',
  'Indian Culture & History':  'scp-framework_subject_indiancultureandhistory',
  'Sanskrit':                  'scp-framework_subject_sanskrit',
  'Business Studies':          'scp-framework_subject_business-studies',
};

export const SCP_COURSE_TYPE_NAME_TO_ID: Record<string, string> = {
  'Foundation Course': 'scp-framework_coursetype_foundationcourse',
  'Main Course':       'scp-framework_coursetype_maincourse',
  'Exam Prep':         'scp-framework_coursetype_examprep',
  'Enablers':          'scp-framework_coursetype_enablers',
};

// ─── Column Definitions ───────────────────────────────────────
// Each entry: { header, apiField, lookupKey (for dropdown), required }

export interface ColumnDef {
  header: string;        // Excel column header text (shown to user)
  apiField: string;      // Field name sent to the platform API
  lookupKey?: keyof typeof LOOKUP;  // If set → this column gets a dropdown
  required: boolean;
  note?: string;         // Hint text for the Instructions column
}

// ─── POS Framework Column Sets ────────────────────────────────

// NOTE: Content always uses pos-framework for ALL users.
// Medium and Grade Level are NOT in the pos-framework taxonomy and are NOT in the
// content form-read API — sending them causes "range data is empty" API errors.
// Domain and SubDomain are valid pos-framework fields for content.
export const POS_CONTENT_COLUMNS: ColumnDef[] = [
  { header: 'Temp ID*',           apiField: 'tempId',          required: true,  note: 'Format: TEMP_CONTENT_N e.g. TEMP_CONTENT_1' },
  { header: 'Name*',              apiField: 'name',            required: true,  note: 'Title of the content (max 250 chars)' },
  { header: 'Description',        apiField: 'description',     required: false },
  { header: 'Primary Category*',  apiField: 'primaryCategory', required: true,  lookupKey: 'POS_PRIMARY_CATEGORIES_CONTENT' },
  { header: 'Subject*',           apiField: 'subject',         required: true,  lookupKey: 'POS_SUBJECTS' },
  { header: 'Domain',             apiField: 'domain',          required: false, lookupKey: 'POS_DOMAINS' },
  { header: 'Sub Domain',         apiField: 'subDomain',       required: false, lookupKey: 'POS_SUB_DOMAINS' },
  { header: 'Target Age Group',   apiField: 'targetAgeGroup',  required: false, lookupKey: 'POS_TARGET_AGE_GROUPS' },
  { header: 'Primary User',       apiField: 'primaryUser',     required: false, lookupKey: 'POS_PRIMARY_USERS' },
  { header: 'Content Language*',  apiField: 'contentLanguage', required: true,  lookupKey: 'CONTENT_LANGUAGES', note: 'Single language — language the content is written in' },
  { header: 'Program',            apiField: 'program',         required: false, lookupKey: 'POS_PROGRAMS' },
  { header: 'Keywords',           apiField: 'keywords',        required: false, note: 'Comma-separated keywords' },
  { header: 'License',            apiField: 'license',         required: false, lookupKey: 'LICENSES' },
  { header: 'Copyright',          apiField: 'copyright',       required: false },
  { header: 'Copyright Year',     apiField: 'copyrightYear',   required: false },
  { header: 'Author',             apiField: 'author',          required: false },
  { header: 'Creator',            apiField: 'creator',         required: false, note: 'Name of the content creator (shown in Creator column on the platform)' },
  { header: 'Google Drive URL*',  apiField: 'driveUrl',        required: true,  note: 'Public share link: https://drive.google.com/file/d/FILE_ID/view' },
  { header: 'File Type*',         apiField: 'fileType',        required: true,  lookupKey: 'FILE_TYPES' },
];

// POS QS form-read (obj-cat:practice-question-set_questionset_pos-channel) fields:
// domain (required), subDomain (required), subject (required),
// targetAgeGroup, primaryUser, contentLanguage, assessmentType, evaluationType, program.
// NO medium, NO gradeLevel in POS QS.
// POS QS form-read required fields (obj-cat:practice-question-set_questionset_pos-channel):
// name ✓, description ✓ (required:true in form-read), domain ✓, subDomain ✓, subject ✓,
// evaluationType ✓ (required:true in form-read with required validation message).
export const POS_QS_COLUMNS: ColumnDef[] = [
  { header: 'Temp ID*',           apiField: 'tempId',          required: true,  note: 'Format: TEMP_QS_N e.g. TEMP_QS_1' },
  { header: 'Name*',              apiField: 'name',            required: true },
  { header: 'Description*',       apiField: 'description',     required: true },
  { header: 'Primary Category*',  apiField: 'primaryCategory', required: true,  lookupKey: 'POS_PRIMARY_CATEGORIES_QS' },
  { header: 'Domain*',            apiField: 'domain',          required: true,  lookupKey: 'POS_DOMAINS' },
  { header: 'Sub Domain*',        apiField: 'subDomain',       required: true,  lookupKey: 'POS_SUB_DOMAINS' },
  { header: 'Subject*',           apiField: 'subject',         required: true,  lookupKey: 'POS_SUBJECTS' },
  { header: 'Target Age Group',   apiField: 'targetAgeGroup',  required: false, lookupKey: 'POS_TARGET_AGE_GROUPS' },
  { header: 'Primary User',       apiField: 'primaryUser',     required: false, lookupKey: 'POS_PRIMARY_USERS' },
  { header: 'Content Language',   apiField: 'contentLanguage', required: false, lookupKey: 'CONTENT_LANGUAGES', note: 'Language the content is written in' },
  { header: 'Program',            apiField: 'program',         required: false, lookupKey: 'POS_PROGRAMS' },
  { header: 'Assessment Type',    apiField: 'assessmentType',  required: false, lookupKey: 'ASSESSMENT_TYPES' },
  { header: 'Evaluation Type*',   apiField: 'evaluationType',  required: true,  lookupKey: 'EVALUATION_TYPES', note: 'online = Auto-Graded | offline = Facilitator-Graded | ai = AI-Assisted' },
  { header: 'Max Attempts',       apiField: 'maxAttempts',     required: false, note: 'Positive integer e.g. 3' },
  { header: 'Show Feedback',      apiField: 'showFeedback',    required: false, note: 'true or false' },
  { header: 'Show Solutions',     apiField: 'showSolutions',   required: false, note: 'true or false' },
];

// POS Course form-read (obj-cat:course_collection_pos-channel) fields:
// targetDomainIds, targetSubDomainIds, targetSubjectIds (all with output:"identifier"),
// targetAgeGroup, primaryUser, contentLanguage, program.
// NO medium, NO gradeLevel, NO plain subject/language for POS Course.
export const POS_COURSE_COLUMNS: ColumnDef[] = [
  { header: 'Temp ID*',           apiField: 'tempId',             required: true,  note: 'Format: TEMP_COURSE_N e.g. TEMP_COURSE_1' },
  { header: 'Name*',              apiField: 'name',               required: true },
  { header: 'Description',        apiField: 'description',        required: false },
  { header: 'Domain*',            apiField: 'targetDomainIds',    required: true,  lookupKey: 'POS_DOMAINS',          note: 'Select from dropdown — sent as platform identifier' },
  { header: 'Sub Domain*',        apiField: 'targetSubDomainIds', required: true,  lookupKey: 'POS_SUB_DOMAINS',      note: 'Select from dropdown — sent as platform identifier' },
  { header: 'Subject*',           apiField: 'targetSubjectIds',   required: true,  lookupKey: 'POS_SUBJECTS',         note: 'Select from dropdown — sent as platform identifier' },
  // targetAgeGroup has validations:[{type:"required"}] in POS course form-read
  { header: 'Target Age Group*',  apiField: 'targetAgeGroup',     required: true,  lookupKey: 'POS_TARGET_AGE_GROUPS' },
  { header: 'Primary User',       apiField: 'primaryUser',        required: false, lookupKey: 'POS_PRIMARY_USERS' },
  { header: 'Content Language',   apiField: 'contentLanguage',    required: false, lookupKey: 'CONTENT_LANGUAGES',    note: 'Language the content is written in' },
  { header: 'Program*',           apiField: 'program',            required: true,  lookupKey: 'POS_PROGRAMS' },
  { header: 'Keywords',           apiField: 'keywords',           required: false },
  { header: 'License',            apiField: 'license',            required: false, lookupKey: 'LICENSES' },
  { header: 'Copyright',          apiField: 'copyright',          required: false },
  { header: 'Copyright Year',     apiField: 'copyrightYear',      required: false },
  { header: 'Author',             apiField: 'author',             required: false },
];

// ─── SCP Framework Column Sets ────────────────────────────────

// NOTE: Content always uses pos-framework regardless of logged-in user framework.
// SCP_CONTENT_COLUMNS is intentionally the same as POS_CONTENT_COLUMNS because
// the platform form-read for content uses pos-framework for all users.
// courseType is NOT a valid content field — it only applies to QS/Courses.
export const SCP_CONTENT_COLUMNS: ColumnDef[] = POS_CONTENT_COLUMNS;

export const SCP_QS_COLUMNS: ColumnDef[] = [
  { header: 'Temp ID*',           apiField: 'tempId',          required: true,  note: 'Format: TEMP_QS_N e.g. TEMP_QS_1' },
  { header: 'Name*',              apiField: 'name',            required: true },
  { header: 'Description',        apiField: 'description',     required: false },
  { header: 'Primary Category*',  apiField: 'primaryCategory', required: true,  lookupKey: 'SCP_PRIMARY_CATEGORIES_QS' },
  { header: 'Subject*',           apiField: 'subject',         required: true,  lookupKey: 'SCP_SUBJECTS' },
  { header: 'Board',              apiField: 'board',           required: false, lookupKey: 'SCP_BOARDS' },
  { header: 'Medium',             apiField: 'medium',          required: false, lookupKey: 'SCP_MEDIUMS' },
  { header: 'Grade Level',        apiField: 'gradeLevel',      required: false, lookupKey: 'SCP_GRADE_LEVELS' },
  { header: 'Course Type',        apiField: 'courseType',      required: false, lookupKey: 'SCP_COURSE_TYPES' },
  { header: 'Program',            apiField: 'program',         required: false, lookupKey: 'SCP_PROGRAMS' },
  // Language is optional for SCP QS — platform does not enforce it as required
  { header: 'Language',           apiField: 'language',        required: false, lookupKey: 'LANGUAGES' },
  { header: 'Assessment Type',    apiField: 'assessmentType',  required: false, lookupKey: 'ASSESSMENT_TYPES' },
  { header: 'Evaluation Type',    apiField: 'evaluationType',  required: false, lookupKey: 'EVALUATION_TYPES', note: 'online, offline or ai' },
  { header: 'Max Attempts',       apiField: 'maxAttempts',     required: false, note: 'Positive integer e.g. 3' },
  { header: 'Show Feedback',      apiField: 'showFeedback',    required: false, note: 'true or false' },
  { header: 'Show Solutions',     apiField: 'showSolutions',   required: false, note: 'true or false' },
];

export const SCP_COURSE_COLUMNS: ColumnDef[] = [
  { header: 'Temp ID*',              apiField: 'tempId',          required: true,  note: 'Format: TEMP_COURSE_N e.g. TEMP_COURSE_1' },
  { header: 'Name*',                 apiField: 'name',            required: true },
  { header: 'Description',           apiField: 'description',     required: false },
  { header: 'Subject*',              apiField: 'subject',         required: true,  lookupKey: 'SCP_SUBJECTS' },
  { header: 'Board',                 apiField: 'board',           required: false, lookupKey: 'SCP_BOARDS' },
  { header: 'Medium',                apiField: 'medium',          required: false, lookupKey: 'SCP_MEDIUMS' },
  { header: 'Grade Level',           apiField: 'gradeLevel',      required: false, lookupKey: 'SCP_GRADE_LEVELS' },
  { header: 'Course Type',           apiField: 'courseType',      required: false, lookupKey: 'SCP_COURSE_TYPES' },
  { header: 'Program',               apiField: 'program',         required: false, lookupKey: 'SCP_PROGRAMS' },
  // SCP course form-read uses contentLanguage (plain string), not language (array)
  { header: 'Content Language',      apiField: 'contentLanguage', required: false, lookupKey: 'CONTENT_LANGUAGES' },
  { header: 'Keywords',              apiField: 'keywords',        required: false },
  { header: 'License',               apiField: 'license',         required: false, lookupKey: 'LICENSES' },
  { header: 'Copyright',             apiField: 'copyright',       required: false },
  { header: 'Copyright Year',        apiField: 'copyrightYear',   required: false },
  { header: 'Author',                apiField: 'author',          required: false },
];

// ─── Shared sheets (same for both frameworks) ─────────────────

export const QUESTION_COLUMNS: ColumnDef[] = [
  { header: 'QuestionSet Temp ID*', apiField: 'questionSetTempId', required: true,  note: 'Must match a Temp ID from QuestionSets sheet' },
  { header: 'Section Name',         apiField: 'sectionName',       required: false, note: 'e.g. Section 1 — groups questions under a section' },
  { header: 'Question Type*',       apiField: 'questionType',      required: true,  lookupKey: 'QUESTION_TYPES' },
  { header: 'Question Text*',       apiField: 'questionText',      required: true },
  { header: 'Options',              apiField: 'options',           required: false, note: 'MCQ/Arrange: pipe-separated (A|B|C|D). Match: Key:Value|Key:Value' },
  { header: 'Correct Answer',       apiField: 'correctAnswer',     required: false, note: 'MCQ: exact option text. Arrange: correct order. Match: Key:Value pairs' },
  { header: 'Max Score',            apiField: 'maxScore',          required: false, note: 'Positive number e.g. 1' },
  // Blooms Level and Difficulty removed — platform API rejects them as invalid props
  { header: 'Hint',                 apiField: 'hint',              required: false },
  { header: 'Solution',             apiField: 'solution',          required: false },
];

export const COURSE_MAPPING_COLUMNS: ColumnDef[] = [
  { header: 'Course Temp ID*', apiField: 'courseTempId', required: true,  note: 'Must match a Temp ID from Courses sheet' },
  { header: 'Unit Name*',      apiField: 'unitName',     required: true,  note: 'e.g. Unit 1: Introduction — groups children under a unit' },
  { header: 'Child Ref*',      apiField: 'childRef',     required: true,  note: 'Temp ID (TEMP_CONTENT_1, TEMP_QS_1) OR real do_xxxx identifier' },
  { header: 'Child Type*',     apiField: 'childType',    required: true,  lookupKey: 'CHILD_TYPES' },
  { header: 'Sequence*',       apiField: 'sequence',     required: true,  note: 'Order within the unit e.g. 1, 2, 3' },
];

export const EXISTING_MAPPING_COLUMNS: ColumnDef[] = [
  { header: 'Temp ID*',             apiField: 'tempId',             required: true,  note: 'e.g. TEMP_EXISTING_1 — use this in CourseChildrenMapping' },
  { header: 'Existing Identifier*', apiField: 'existingIdentifier', required: true,  note: 'Real platform identifier e.g. do_abc123' },
  { header: 'Entity Type*',         apiField: 'entityType',         required: true,  lookupKey: 'CHILD_TYPES' },
];

// ─── Framework selector ───────────────────────────────────────

export const getFrameworkColumns = (fw: FrameworkId) => ({
  // Content ALWAYS uses POS columns — pos-framework is used for all users
  // regardless of collectionFramework (confirmed by platform form-read API).
  contentColumns:  POS_CONTENT_COLUMNS,
  qsColumns:       fw === 'scp-framework' ? SCP_QS_COLUMNS     : POS_QS_COLUMNS,
  courseColumns:   fw === 'scp-framework' ? SCP_COURSE_COLUMNS : POS_COURSE_COLUMNS,
  questionColumns: QUESTION_COLUMNS,
  mappingColumns:  COURSE_MAPPING_COLUMNS,
  existingColumns: EXISTING_MAPPING_COLUMNS,
});

// ─── Build header → apiField reverse map (used by parser) ────

export const buildHeaderToApiFieldMap = (
  cols: ColumnDef[]
): Record<string, string> =>
  Object.fromEntries(cols.map((c) => [c.header, c.apiField]));

// ─── Lookup sheet column definitions ─────────────────────────
// Each entry: column header in LookupData sheet → LOOKUP key → column letter

export interface LookupColumn {
  header: string;
  lookupKey: keyof typeof LOOKUP;
}

export const getLookupColumns = (fw: FrameworkId): LookupColumn[] => {
  const shared: LookupColumn[] = [
    { header: 'File Types',         lookupKey: 'FILE_TYPES' },
    { header: 'Question Types',     lookupKey: 'QUESTION_TYPES' },
    { header: 'Child Types',        lookupKey: 'CHILD_TYPES' },
    { header: 'Languages',          lookupKey: 'LANGUAGES' },
    { header: 'Content Languages',  lookupKey: 'CONTENT_LANGUAGES' },
    { header: 'Licenses',           lookupKey: 'LICENSES' },
    { header: 'Blooms Levels',      lookupKey: 'BLOOMS_LEVELS' },
    { header: 'Difficulty Levels',  lookupKey: 'DIFFICULTY_LEVELS' },
    { header: 'Evaluation Types',   lookupKey: 'EVALUATION_TYPES' },
    { header: 'Assessment Types',   lookupKey: 'ASSESSMENT_TYPES' },
  ];

  // Content sheet ALWAYS uses POS columns for all users (content uses pos-framework regardless).
  // These POS lookup columns must be present in LookupData for BOTH SCP and POS templates
  // so that Content sheet dropdowns resolve correctly.
  const posContentLookups: LookupColumn[] = [
    { header: 'Content Primary Categories', lookupKey: 'POS_PRIMARY_CATEGORIES_CONTENT' },
    { header: 'Content Subjects',           lookupKey: 'POS_SUBJECTS' },
    { header: 'Content Domains',            lookupKey: 'POS_DOMAINS' },
    { header: 'Content Sub Domains',        lookupKey: 'POS_SUB_DOMAINS' },
    { header: 'Content Mediums',            lookupKey: 'POS_MEDIUMS' },
    { header: 'Content Grade Levels',       lookupKey: 'POS_GRADE_LEVELS' },
    { header: 'Target Age Groups',          lookupKey: 'POS_TARGET_AGE_GROUPS' },
    { header: 'Primary Users',              lookupKey: 'POS_PRIMARY_USERS' },
    { header: 'Content Programs',           lookupKey: 'POS_PROGRAMS' },
  ];

  if (fw === 'scp-framework') {
    return [
      ...shared,
      ...posContentLookups,                                              // always needed for Content sheet
      { header: 'Primary Categories (QS)',  lookupKey: 'SCP_PRIMARY_CATEGORIES_QS' },
      { header: 'Subjects (QS/Course)',     lookupKey: 'SCP_SUBJECTS' },
      { header: 'Boards',                   lookupKey: 'SCP_BOARDS' },
      { header: 'Mediums (QS/Course)',      lookupKey: 'SCP_MEDIUMS' },
      { header: 'Grade Levels (QS/Course)', lookupKey: 'SCP_GRADE_LEVELS' },
      { header: 'Course Types',             lookupKey: 'SCP_COURSE_TYPES' },
      { header: 'Programs (QS/Course)',     lookupKey: 'SCP_PROGRAMS' },
    ];
  }

  return [
    ...shared,
    ...posContentLookups,
    { header: 'Primary Categories (QS)',  lookupKey: 'POS_PRIMARY_CATEGORIES_QS' },
    // POS QS and Course also need these (content lookups above cover the same keys,
    // but keep explicit entries so the LookupData sheet headings are clear)
    { header: 'Programs (QS/Course)',     lookupKey: 'POS_PROGRAMS' },
    { header: 'Subjects (QS/Course)',     lookupKey: 'POS_SUBJECTS' },
    { header: 'Domains (QS/Course)',      lookupKey: 'POS_DOMAINS' },
    { header: 'Sub Domains (QS/Course)',  lookupKey: 'POS_SUB_DOMAINS' },
  ];
};
