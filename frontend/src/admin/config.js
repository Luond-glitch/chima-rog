/**
 * Admin form definitions. To add a new editable content type, add an entry here
 * (and the matching model in backend/chima/models.py + RESOURCES).
 * Field types: text | textarea | number | select | checkbox | date | month | image | images | lines | pairs | icon
 */
const CATS_POST = ['News', 'Project Update', 'Article', 'Success Story', 'Event', 'Field Report']

export const RESOURCES = {
  projects: {
    title: 'Projects', single: 'project', icon: 'leaf',
    columns: [['title', 'Title'], ['status', 'Status'], ['location', 'Location']],
    fields: [
      { k: 'title', l: 'Project title', t: 'text', req: true },
      { k: 'status', l: 'Implementation status', t: 'select', o: ['Ongoing', 'Completed', 'Planned'] },
      { k: 'featured', l: 'Feature on homepage', t: 'checkbox' },
      { k: 'summary', l: 'Short summary', t: 'textarea', rows: 2, req: true },
      { k: 'overview', l: 'Project overview', t: 'textarea', rows: 5 },
      { k: 'objectives', l: 'Objectives (one per line)', t: 'lines' },
      { k: 'location', l: 'Implementation location', t: 'text' },
      { k: 'program', l: 'Focus area / programme', t: 'text' },
      { k: 'activities', l: 'Activities & interventions (one per line)', t: 'lines' },
      { k: 'beneficiaries', l: 'Beneficiaries & target communities', t: 'text' },
      { k: 'achievements', l: 'Achievements & impact (one per line: Label | Value)', t: 'pairs' },
      { k: 'start_date', l: 'Start (YYYY-MM)', t: 'month' },
      { k: 'end_date', l: 'End (YYYY-MM, blank if ongoing)', t: 'month' },
      { k: 'cover_url', l: 'Cover photo', t: 'image', folder: 'projects' },
      { k: 'gallery', l: 'Photo gallery', t: 'images', folder: 'projects' },
      { k: 'video_url', l: 'Video (YouTube link or uploaded file URL)', t: 'text' },
    ],
  },
  posts: {
    title: 'Stories & News', single: 'story', icon: 'file',
    columns: [['title', 'Title'], ['category', 'Category'], ['published', 'Published']],
    fields: [
      { k: 'title', l: 'Headline', t: 'text', req: true },
      { k: 'category', l: 'Category', t: 'select', o: CATS_POST },
      { k: 'published', l: 'Published (untick to keep as draft)', t: 'checkbox', def: true },
      { k: 'excerpt', l: 'Short excerpt', t: 'textarea', rows: 2, req: true },
      { k: 'body', l: 'Full story (blank line between paragraphs)', t: 'textarea', rows: 10 },
      { k: 'author', l: 'Author', t: 'text', def: 'CHIMA Communications' },
      { k: 'event_date', l: 'Event / story date', t: 'date' },
      { k: 'location', l: 'Location', t: 'text' },
      { k: 'cover_url', l: 'Cover photo', t: 'image', folder: 'stories' },
      { k: 'gallery', l: 'Photo gallery / field report photos', t: 'images', folder: 'stories' },
    ],
  },
  activities: {
    title: 'Activities', single: 'activity', icon: 'calendar',
    columns: [['title', 'Activity'], ['activity_date', 'Date'], ['location', 'Location']],
    fields: [
      { k: 'title', l: 'Activity title', t: 'text', req: true },
      { k: 'category', l: 'Category', t: 'select', o: ['Tree planting', 'Training', 'Education', 'Community', 'Youth', 'Awareness', 'Other'] },
      { k: 'activity_date', l: 'Date', t: 'date' },
      { k: 'location', l: 'Location', t: 'text' },
      { k: 'participants', l: 'Participants', t: 'number' },
      { k: 'description', l: 'Description', t: 'textarea', rows: 4 },
      { k: 'image_url', l: 'Photo', t: 'image', folder: 'activities' },
    ],
  },
  programs: {
    title: 'Programs', single: 'program', icon: 'target',
    columns: [['title', 'Focus area'], ['sort_order', 'Order']],
    fields: [
      { k: 'title', l: 'Title', t: 'text', req: true },
      { k: 'icon', l: 'Icon', t: 'icon' },
      { k: 'summary', l: 'Summary', t: 'textarea', rows: 2, req: true },
      { k: 'description', l: 'Detailed description', t: 'textarea', rows: 5 },
      { k: 'highlights', l: 'Highlights (one per line)', t: 'lines' },
      { k: 'sort_order', l: 'Display order', t: 'number' },
      { k: 'image_url', l: 'Image', t: 'image', folder: 'programs' },
    ],
  },
  stats: {
    title: 'Impact Statistics', single: 'statistic', icon: 'award',
    columns: [['label', 'Indicator'], ['value', 'Value'], ['suffix', 'Suffix']],
    fields: [
      { k: 'label', l: 'Indicator name', t: 'text', req: true },
      { k: 'value', l: 'Verified figure', t: 'number' },
      { k: 'suffix', l: 'Suffix (+, %, …)', t: 'text', def: '+' },
      { k: 'icon', l: 'Icon', t: 'icon' },
      { k: 'description', l: 'Short description', t: 'text' },
      { k: 'sort_order', l: 'Display order', t: 'number' },
    ],
  },
  partners: {
    title: 'Partners', single: 'partner', icon: 'handshake',
    columns: [['name', 'Partner'], ['category', 'Type']],
    fields: [
      { k: 'name', l: 'Partner name', t: 'text', req: true },
      { k: 'category', l: 'Type', t: 'select', o: ['Government', 'Development Partner', 'Funder', 'Research', 'Community Network', 'Private Sector', 'NGO'] },
      { k: 'description', l: 'Description', t: 'textarea', rows: 3 },
      { k: 'collaboration', l: 'Collaboration details', t: 'text' },
      { k: 'website', l: 'Website URL', t: 'text' },
      { k: 'logo_url', l: 'Logo', t: 'image', folder: 'partners' },
    ],
  },
  leaders: {
    title: 'Leadership', single: 'leader', icon: 'users',
    columns: [['name', 'Name'], ['role', 'Role'], ['group', 'Group']],
    hint: 'Add each executive member here: name, role, short bio, photo and contact. They appear on the About page under “Leadership & governance”.',
    fields: [
      { k: 'name', l: 'Full name', t: 'text', req: true },
      { k: 'role', l: 'Position / role', t: 'text', req: true },
      { k: 'group', l: 'Group', t: 'select', o: ['Executive', 'Board', 'Advisor', 'Staff'] },
      { k: 'bio', l: 'Short biography', t: 'textarea', rows: 4 },
      { k: 'photo_url', l: 'Photo', t: 'image', folder: 'leadership' },
      { k: 'email', l: 'Email', t: 'text' },
      { k: 'phone', l: 'Phone', t: 'text' },
      { k: 'linkedin', l: 'LinkedIn URL', t: 'text' },
      { k: 'sort_order', l: 'Display order (0 first)', t: 'number' },
    ],
  },
  media: {
    title: 'Media & Files', single: 'file', icon: 'image',
    columns: [['title', 'Title'], ['kind', 'Type'], ['category', 'Category']],
    fields: [
      { k: 'title', l: 'Title', t: 'text', req: true },
      { k: 'kind', l: 'Type', t: 'select', o: ['image', 'video', 'document'] },
      { k: 'category', l: 'Category', t: 'text', def: 'Field' },
      { k: 'url', l: 'File (photo, video or PDF)', t: 'image', folder: 'media', any: true },
      { k: 'thumbnail_url', l: 'Video thumbnail (optional)', t: 'image', folder: 'media' },
      { k: 'caption', l: 'Caption', t: 'text' },
    ],
  },
}

export const SETTINGS_FIELDS = [
  ['Contact details', [
    ['email', 'Official email', 'text'], ['phone', 'Telephone', 'text'], ['address', 'Physical address', 'text'],
    ['map_query', 'Map location (address or place name for the embedded map)', 'text'],
  ]],
  ['Social media', [
    ['facebook', 'Facebook URL', 'text'], ['twitter', 'X / Twitter URL', 'text'], ['instagram', 'Instagram URL', 'text'],
    ['linkedin', 'LinkedIn URL', 'text'], ['youtube', 'YouTube URL', 'text'],
  ]],
  ['About CHIMA', [
    ['mission', 'Mission', 'area'], ['vision', 'Vision', 'area'], ['history', 'Background & history (blank line between paragraphs)', 'area6'],
    ['values', 'Core values (one per line: Title | Description)', 'area6'],
    ['objectives', 'Objectives & strategic priorities (one per line)', 'area6'],
    ['approach', 'Approach & methodology (one per line: Title | Description)', 'area6'],
  ]],
  ['Governance & membership', [
    ['area', 'Area of operation', 'area'],
    ['roles', 'Executive Committee roles (one per line: Role | Duties)', 'area6'],
    ['eligibility', 'Membership eligibility', 'area'],
    ['membership', 'Membership categories (one per line: Category | Fee)', 'area6'],
    ['membership_note', 'Membership note', 'area'],
  ]],
]
