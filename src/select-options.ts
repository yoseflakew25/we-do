export interface SelectOption {
  value: string;
  label: string;
}

export interface YesNoOption {
  value: boolean;
  label: string;
}

export const ORG_AREA_OPTIONS: SelectOption[] = [
  {
    value: 'Education and Literacy',
    label: 'Education and Literacy',
  },
  {
    value: 'Technology',
    label: 'Technology',
  },
  {
    value: 'Children and Youth',
    label: 'Children and Youth',
  },
  {
    value: 'Health and Medicine',
    label: 'Health and Medicine',
  },
  {
    value: 'People with Disabilities',
    label: 'People with Disabilities',
  },
  {
    value: 'Sports and Recreation',
    label: 'Sports and Recreation',
  },
  {
    value: 'Homeless and Housing',
    label: 'Homeless and Housing',
  },
  {
    value: 'Environment',
    label: 'Environment',
  },

  { value: 'Community Development', label: 'Community Development' },

  { value: `Women's Empowerment`, label: `Women's Empowerment` },
  {
    value: 'Media and Broadcasting',
    label: 'Media and Broadcasting',
  },
  {
    value: 'Maintenance',
    label: 'Maintenance',
  },
];
export const PERKS_AND_BENEFITS_OPTIONS: SelectOption[] = [
  { value: 'Paid', label: 'Paid' },
  { value: 'Internet Package', label: 'Internet Package' },
  { value: 'Commute Stipend', label: 'Commute Stipend' },
];

export const OPPORTUNITY_TYPE_OPTIONS: SelectOption[] = [
  { value: 'internship', label: 'Internship' },
  { value: 'volunteering', label: 'Volunteer' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'contract', label: 'Freelance' },
];
export const LOCATION_OPTIONS: SelectOption[] = [
  { value: 'Abu Hamour', label: 'Abu Hamour' },
  { value: 'Al Asiri', label: 'Al Asiri' },
  { value: 'Al Daayen', label: 'Al Daayen' },
  { value: 'Al Gharrafa', label: 'Al Gharrafa' },
  { value: 'Al Hilal', label: 'Al Hilal' },
  { value: 'Al Kheesa', label: 'Al Kheesa' },
  { value: 'Al Khor', label: 'Al Khor' },
  { value: 'Al Mansoura', label: 'Al Mansoura' },
  { value: 'Al Muntazah', label: 'Al Muntazah' },
  { value: 'Al Nasr', label: 'Al Nasr' },
  { value: 'Al Rayyan', label: 'Al Rayyan' },
  { value: 'Al Ruwais', label: 'Al Ruwais' },
  { value: 'Al Sailiya', label: 'Al Sailiya' },
  { value: 'Al Shahaniya', label: 'Al Shahaniya' },
  { value: 'Al Shamal', label: 'Al Shamal' },
  { value: 'Al Thumama', label: 'Al Thumama' },
  { value: 'Ain Khaled', label: 'Ain Khaled' },
  { value: 'Bin Mahmooud', label: 'Bin Mahmooud' },
  { value: 'Al Wakrah', label: 'Al Wakrah' },
  { value: 'Al Wukair', label: 'Al Wukair' },
  { value: 'Dukhan', label: 'Dukhan' },
  { value: 'Doha', label: 'Doha' },
  { value: 'Lusail', label: 'Lusail' },
  { value: 'Madinat Khalifa', label: 'Madinat Khalifa' },
  { value: 'Mesaieed', label: 'Mesaieed' },
  { value: 'Najma', label: 'Najma' },
  { value: 'New Salata', label: 'New Salata' },
  { value: 'Ras Laffan', label: 'Ras Laffan' },
  { value: 'Umm Salal', label: 'Umm Salal' },
];

export const SKILLS_OPTIONS: SelectOption[] = [
  { value: 'Accountant', label: 'Accountant' },
  { value: 'Actor', label: 'Actor' },
  { value: 'Adaptability', label: 'Adaptability' },
  { value: 'Advocacy/public speaking', label: 'Advocacy/public speaking' },
  { value: 'Architect', label: 'Architect' },
  { value: 'Artist', label: 'Artist' },
  { value: 'Auto mechanic', label: 'Auto mechanic' },
  { value: 'Baker', label: 'Baker' },
  { value: 'Barber', label: 'Barber' },
  { value: 'Bartender', label: 'Bartender' },
  { value: 'Bookkeeper', label: 'Bookkeeper' },
  { value: 'Bus driver', label: 'Bus driver' },
  { value: 'Butcher', label: 'Butcher' },
  { value: 'Cashier', label: 'Cashier' },
  { value: 'Chef', label: 'Chef' },
  { value: 'Cloud computing', label: 'Cloud computing' },
  { value: 'Coaching/mentoring', label: 'Coaching/mentoring' },
  { value: 'Communication', label: 'Communication' },
  { value: 'Conflict resolution', label: 'Conflict resolution' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Creativity', label: 'Creativity' },
  { value: 'Cultural sensitivity', label: 'Cultural sensitivity' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'Data  analysis', label: 'Data  analysis' },
  { value: 'Data analysis', label: 'Data analysis' },
  { value: 'Database management', label: 'Database management' },
  { value: 'Dental hygienist', label: 'Dental hygienist' },
  { value: 'Dentist', label: 'Dentist' },
  { value: 'Designer', label: 'Designer' },
  { value: 'Dietitian', label: 'Dietitian' },
  { value: 'Digital marketing', label: 'Digital marketing' },
  { value: 'Economist', label: 'Economist' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Engineer', label: 'Engineer' },
  { value: 'Event planning', label: 'Event planning' },
  { value: 'Farmer', label: 'Farmer' },
  { value: 'Financial management', label: 'Financial management' },
  { value: 'Firefighter', label: 'Firefighter' },
  { value: 'Fundraising', label: 'Fundraising' },
  { value: 'Gardener', label: 'Gardener' },
  { value: 'Grant writing', label: 'Grant  writing' },
  { value: 'Graphic design', label: 'Graphic  design' },
  { value: 'Graphic design', label: 'Graphic design' },
  { value: 'Hairdresser', label: 'Hairdresser' },
  { value: 'IT support', label: 'IT support' },
  { value: 'Journalist', label: 'Journalist' },
  { value: 'Judge', label: 'Judge' },
  { value: 'Labourer', label: 'Labourer' },
  { value: 'Lawyer', label: 'Lawyer' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Librarian', label: 'Librarian' },
  { value: 'Lifeguard', label: 'Lifeguard' },
  { value: 'Mobile app development', label: 'Mobile app development' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Nurse', label: 'Nurse' },
  { value: 'Optician', label: 'Optician' },
  { value: 'Painter', label: 'Painter' },
  { value: 'Pharmacist', label: 'Pharmacist' },
  { value: 'Physician', label: 'Physician' },
  { value: 'Plumber', label: 'Plumber' },
  { value: 'Problem-solving', label: 'Problem-solving' },
  { value: 'Problem-solving', label: 'Problem-solving' },
  { value: 'Programming', label: 'Programming' },
  { value: 'Project management', label: 'Project management' },
  { value: 'Research', label: 'Research' },
  { value: 'Scientist', label: 'Scientist' },
  { value: 'Secretary', label: 'Secretary' },
  { value: 'Social media management', label: 'Social media management' },
  { value: 'Social media marketing', label: 'Social media marketing' },
  { value: 'Software developer', label: 'Software developer' },
  { value: 'Software tester', label: 'Software tester' },
  { value: 'Soldier', label: 'Soldier' },
  { value: 'Tailor', label: 'Tailor' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Teaching/training', label: 'Teaching/training' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Time management', label: 'Time management' },
  { value: 'User experience(UX) design', label: 'User experience(UX) design' },
  { value: 'Veterinarian', label: 'Veterinarian' },
  { value: 'Virtual reality', label: 'Virtual reality' },
  { value: 'Volunteer coordination', label: 'Volunteer coordination' },
  { value: 'Website development', label: 'Website development' },
  { value: 'Worker', label: 'Worker' },
  { value: 'Writing/editing', label: 'Writing/editing' },
  { value: 'software testing', label: 'software testing' },
];

export const POPULAR_LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'French', label: 'French' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'German', label: 'German' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Afan Oromo', label: 'Afan Ormomo' },
  { value: 'Amharic', label: 'Amharic' },
  { value: 'Tigrinya', label: 'Tigrinya' },
  { value: 'Somali', label: 'Somali' },
  { value: 'Sidamo', label: 'Sidamo' },
  { value: 'Afar', label: 'Afar' },
];

export const OP_TYPE_OPTIONS: SelectOption[] = [
  { value: 'inPerson', label: 'In Person' },
  { value: 'virtual', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];
export const OP_PAID_OPTIONS: YesNoOption[] = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export const PAYMENT_TYPE_OPTIONS: SelectOption[] = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'one-time', label: 'One Time' },
];

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'USD', label: 'USD' },
  { value: 'QAR', label: 'QAR' },
];

export const OP_STATUS_OPTIONS: SelectOption[] = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

export const VOL_POOL_OPTIONS: SelectOption[] = [
  { value: 'public', label: 'Publicly Visible' },
  { value: 'private', label: 'Interested' },
];

export const ORG_STATUS_OPTIONS: SelectOption[] = [
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
];

export const APPLICANT_STATUS_OPTIONS: SelectOption[] = [
  { value: 'pending', label: 'Applied' },
  { value: 'in-review', label: 'In Review' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer-extended', label: 'Offer Extended' },
  { value: 'hired', label: 'Hired' },
  { value: 'declined', label: 'Declined' },
  { value: 'certified', label: 'Certified' },
];

export const NGO_TYPE_OPTIONS: SelectOption[] = [
  { value: 'Local', label: 'Local' },
  { value: 'International', label: 'International' },
];
export const ORGANIZATION_TYPE_OPTIONS: SelectOption[] = [
  { value: 'Non-Profit', label: 'Non-Profit' },
  { value: 'For-Profit', label: 'For-Profit' },
];

export const PROFESSION_OPTIONS: SelectOption[] = [
  {
    value: 'Software Developer/Engineer',
    label: 'Software Developer/Engineer',
  },
  {
    value: 'Doctor',
    label: 'Doctor',
  },
  {
    value: 'Nurse',
    label: 'Nurse',
  },
  {
    value: 'Pharmacist',
    label: 'Pharmacist',
  },
  {
    value: 'Teacher/Educator',
    label: 'Teacher/Educator',
  },
  {
    value: 'Data Scientist/Analyst',
    label: 'Data Scientist/Analyst',
  },
  {
    value: 'Machine Learning Engineer',
    label: 'Machine Learning Engineer',
  },
  {
    value: 'Language Translator',
    label: 'Language Translator',
  },
  {
    value: 'Digital Marketer/Social Media Manager',
    label: 'Digital Marketer/Social Media Manager',
  },
  {
    value: 'Financial Analyst/Accountant',
    label: 'Financial Analyst/Accountant',
  },
  {
    value: 'Cybersecurity Specialist',
    label: 'Cybersecurity Specialist',
  },
  {
    value: 'Graphic Designer/UX Designer',
    label: 'Graphic Designer/UX Designer',
  },
  {
    value: 'Sales Representative',
    label: 'Sales Representative',
  },
  {
    value: 'Project Manager',
    label: 'Project Manager',
  },
  {
    value: 'Mechanical Engineer',
    label: 'Mechanical Engineer',
  },
  {
    value: 'Civil Engineer',
    label: 'Civil Engineer',
  },
  {
    value: 'Lawyer/Paralegal',
    label: 'Lawyer/Paralegal',
  },
  {
    value: 'Customer Support Specialist',
    label: 'Customer Support Specialist',
  },
  {
    value: 'Construction Worker',
    label: 'Construction Worker',
  },
  {
    value: 'Administrative Assistant',
    label: 'Administrative Assistant',
  },
  {
    value: 'Electrician',
    label: 'Electrician',
  },
  {
    value: 'Plumber',
    label: 'Plumber',
  },
  {
    value: 'Chef/Cook',
    label: 'Chef/Cook',
  },
  {
    value: 'Human Resources (HR) Manager',
    label: 'Human Resources (HR) Manager',
  },
  {
    value: 'Chief Executive Officer (CEO)',
    label: 'Chief Executive Officer (CEO)',
  },
  {
    value: 'Chief Technology Officer (CTO)',
    label: 'Chief Technology Officer (CTO)',
  },
  {
    value: 'Chief Financial Officer (CFO)',
    label: 'Chief Financial Officer (CFO)',
  },
  {
    value: 'Chief Operating Officer (COO)',
    label: 'Chief Operating Officer (COO)',
  },
  {
    value: 'Director',
    label: 'Director',
  },
  {
    value: 'Vice President of Sales',
    label: 'Vice President of Sales',
  },
  {
    value: 'Vice President of Marketing',
    label: 'Vice President of Marketing',
  },
  {
    value: 'Vice President of Human Resources',
    label: 'Vice President of Human Resources',
  },
  {
    value: 'Front-end Developer',
    label: 'Front-end Developer',
  },
  {
    value: 'Back-end Developer',
    label: 'Back-end Developer',
  },
  {
    value: 'Mobile Developer',
    label: 'Mobile Developer',
  },
  {
    value: 'High School Student',
    label: 'High School Student',
  },
  {
    value: 'University Student',
    label: 'University Student',
  },
];

export const POPULAR_SKILLS: SelectOption[] = [
  { value: 'Project Management', label: 'Project Management' },
  { value: 'Data Analysis', label: 'Data Analysis' },
  { value: 'Software Development', label: 'Software Development' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  {
    value: 'Artificial Intelligence (AI)',
    label: 'Artificial Intelligence (AI)',
  },
  { value: 'UX/UI Design', label: 'UX/UI Design' },
  { value: 'Digital Marketing', label: 'Digital Marketing' },
  { value: 'Cloud Computing', label: 'Cloud Computing' },
  { value: 'Content Creation', label: 'Content Creation' },
  { value: 'SEO/SEM', label: 'SEO/SEM' },
  { value: 'DevOps', label: 'DevOps' },
  { value: 'Product Management', label: 'Product Management' },
  { value: 'Blockchain', label: 'Blockchain' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Public Relations', label: 'Public Relations' },
  { value: 'E-commerce', label: 'E-commerce' },
  { value: 'Human Resources (HR)', label: 'Human Resources (HR)' },
  { value: 'Event Planning', label: 'Event Planning' },
  { value: 'Social Media Management', label: 'Social Media Management' },
  { value: 'Grant Writing', label: 'Grant Writing' },
  { value: 'Fundraising', label: 'Fundraising' },
  { value: 'Legal Research', label: 'Legal Research' },
  { value: 'Quality Assurance', label: 'Quality Assurance' },
  { value: 'Graphic Design', label: 'Graphic Design' },
  { value: 'Website Development', label: 'Website Development' },
  { value: 'Video Editing', label: 'Video Editing' },
  { value: 'User Research', label: 'User Research' },
  { value: 'Translation', label: 'Translation' },
  { value: 'Negotiation', label: 'Negotiation' },
  {
    value: 'Health and Safety Compliance',
    label: 'Health and Safety Compliance',
  },
  { value: 'Crisis Management', label: 'Crisis Management' },
  { value: 'Research', label: 'Research' },
  { value: 'Networking', label: 'Networking' },
  { value: 'Agile Methodologies', label: 'Agile Methodologies' },
  { value: 'Adaptability', label: 'Adaptability' },
  { value: 'Leadership', label: 'Leadership' },
  { value: 'Communication', label: 'Communication' },
  { value: 'Time Management', label: 'Time Management' },
  { value: 'Problem-solving', label: 'Problem-solving' },
  { value: 'Creativity', label: 'Creativity' },
  { value: 'Coaching/Mentoring', label: 'Coaching/Mentoring' },
  { value: 'Conflict Resolution', label: 'Conflict Resolution' },
  { value: 'Cultural Sensitivity', label: 'Cultural Sensitivity' },
  { value: 'Volunteer Coordination', label: 'Volunteer Coordination' },
  { value: 'Social Media Marketing', label: 'Social Media Marketing' },
  { value: 'Financial Management', label: 'Financial Management' },
  { value: 'Database Management', label: 'Database Management' },
  { value: 'Technical', label: 'Technical' },
  {
    value: 'Artificial Intelligence (AI)',
    label: 'Artificial Intelligence (AI)',
  },
  { value: 'Architect', label: 'Architect' },
  { value: 'Engineer', label: 'Engineer' },
  { value: 'Scientist', label: 'Scientist' },
  { value: 'Dentist', label: 'Dentist' },
  { value: 'Physician', label: 'Physician' },
  { value: 'Veterinarian', label: 'Veterinarian' },
  { value: 'Pharmacist', label: 'Pharmacist' },
  { value: 'Optician', label: 'Optician' },
  { value: 'Judge', label: 'Judge' },
  { value: 'Lawyer', label: 'Lawyer' },
  { value: 'Economist', label: 'Economist' },
  { value: 'Accountant', label: 'Accountant' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Journalist', label: 'Journalist' },
  { value: 'Dietitian', label: 'Dietitian' },
  { value: 'Hairdresser', label: 'Hairdresser' },
  { value: 'Event Marketing', label: 'Event Marketing' },
  { value: 'Copywriting', label: 'Copywriting' },
  { value: 'Environmental Science', label: 'Environmental Science' },
  { value: 'Speech-Language Pathology', label: 'Speech-Language Pathology' },
  { value: 'Artist', label: 'Artist' },
  { value: 'Painter', label: 'Painter' },
  { value: '3D Modeling', label: '3D Modeling' },
  { value: 'Virtual Reality', label: 'Virtual Reality' },
  { value: 'Robotics', label: 'Robotics' },
  { value: 'Baker', label: 'Baker' },
  { value: 'Chef', label: 'Chef' },
  { value: 'Bartender', label: 'Bartender' },
  { value: 'Butcher', label: 'Butcher' },
  { value: 'Auto Mechanic', label: 'Auto Mechanic' },
  { value: 'Electrician', label: 'Electrician' },
  { value: 'Plumber', label: 'Plumber' },
  { value: 'Gardener', label: 'Gardener' },
  { value: 'Farmer', label: 'Farmer' },
  { value: 'Labourer', label: 'Labourer' },
  { value: 'Cashier', label: 'Cashier' },
  { value: 'Secretary', label: 'Secretary' },
  { value: 'Barber', label: 'Barber' },
  { value: 'Bus Driver', label: 'Bus Driver' },
  { value: 'Librarian', label: 'Librarian' },
  { value: 'Firefighter', label: 'Firefighter' },
  { value: 'Soldier', label: 'Soldier' },
  { value: 'Lifeguard', label: 'Lifeguard' },
  { value: 'Tailor', label: 'Tailor' },
  { value: 'Writer/Editor', label: 'Writer/Editor' },
  { value: 'Worker', label: 'Worker' },
  { value: 'Actor', label: 'Actor' },
  { value: 'Baker', label: 'Baker' },
];

export const LANGUAGE_OPTIONS: SelectOption[] = [
  { value: 'English', label: 'English' },
  { value: 'French', label: 'French' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'German', label: 'German' },
  { value: 'Chinese', label: 'Chinese' },
  { value: 'Arabic', label: 'Arabic' },
  { value: 'Afan Oromo', label: 'Afan Ormomo' },
  { value: 'Amharic', label: 'Amharic' },
  { value: 'Tigrinya', label: 'Tigrinya' },
  { value: 'Somali', label: 'Somali' },
  { value: 'Sidamo', label: 'Sidamo' },
  { value: 'Afar', label: 'Afar' },
];

const year = new Date().getFullYear();
const years = Array.from(new Array(225), (_, index) => year - index);

export const YEAR_OPTIONS: SelectOption[] = years.map((year) => ({
  value: year.toString(),
  label: year.toString(),
}));
