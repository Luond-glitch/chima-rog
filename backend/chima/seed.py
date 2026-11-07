"""Mock / placeholder content so the site looks complete from day one.

EVERYTHING here is sample data (numbers, names, partners, stories).
Replace it from the admin dashboard before launch. Seeding only runs when
the tables are empty, so it never overwrites real content.
"""
from .extensions import db
from .models import (Activity, AdminUser, Leader, MediaItem, Partner, Post, Program,
                     Project, Setting, Stat, slugify)

SETTINGS = {
    "org_name": "CHIMA – Chipukizi wa Mazingira",
    "tagline": "Youth-led climate action for Northern Kenya and the Upper Eastern Region",
    "email": "info@chima.or.ke",          # placeholder – not in the constitution
    "phone": "+254 700 000 000",           # placeholder – not in the constitution
    "address": "Isiolo County, Kenya (Headquarters)",
    "map_query": "Isiolo, Kenya",
    "area": "Northern Kenya and the Upper Eastern Region, with potential expansion to other regions as approved by the General Assembly.",
    "facebook": "https://facebook.com/",
    "twitter": "https://x.com/",
    "instagram": "https://instagram.com/",
    "linkedin": "https://linkedin.com/",
    "youtube": "https://youtube.com/",
    # ── from the CHIMA Constitution 2026 (Art. V) ──
    "vision": "A climate-resilient, eco-conscious, and self-reliant Northern Kenya and Upper Eastern Region driven by empowered youth.",
    "mission": "To promote positive social impact and climate action through youth-led, evidence-based, and community-driven initiatives.",
    # ── Art. I Preamble ──
    "history": "Chipukizi wa Mazingira (CHIMA) is a youth-driven, community-based organisation established to promote environmental stewardship, climate resilience and self-reliance among the people of Northern Kenya and the Upper Eastern Region.\n\n"
               "CHIMA is built on the belief that young people — the “Chipukizi” — are the custodians of the present and future environment, and that they can bridge indigenous pastoralist knowledge with contemporary climate science.\n\n"
               "Guided by the Constitution of Kenya, particularly Articles 10, 42, 69 and 174, CHIMA empowers communities to take an active part in environmental governance, natural resource management and sustainable development. Our headquarters is in Isiolo County.",
    # ── Art. V 5.3 ──
    "values": "Integrity|Accountability in everything we do and in how we use resources.\n"
              "Environmental sustainability|Caring for land, water and biodiversity for present and future generations.\n"
              "Inclusivity & equity|Fair opportunity for youth, women, pastoralist communities and everyone else.\n"
              "Youth leadership|Innovation led by young people who are the custodians of the environment.\n"
              "Community participation|Communities shape, own and drive the work.",
    # ── Art. VI ──
    "objectives": "Reduce inter-community conflicts brought about by climate change impacts, such as fights over water and pasture.\n"
                  "Engage youth to positively use their energy and steer away from harmful groupings.\n"
                  "Promote the right to a clean and healthy environment, as guaranteed by Article 42 of the Constitution of Kenya.\n"
                  "Foster youth leadership in environmental conservation and climate resilience.\n"
                  "Strengthen community self-reliance in managing natural resources and responding to climate shocks.\n"
                  "Promote tree growing, ecosystem restoration and sustainable land use in line with national and county government priorities.\n"
                  "Integrate indigenous pastoralist knowledge with modern climate-smart technology.\n"
                  "Enhance environmental education, research and awareness among youth and communities.\n"
                  "Support sustainable livelihoods, green enterprises and eco-innovation.\n"
                  "Encourage public participation in environmental governance and decision-making.\n"
                  "Build partnerships with government, civil society and development partners to advance climate action.",
    "approach": "Youth-led|Young people are at the centre of design, delivery and decision-making.\n"
                "Indigenous + modern|We bridge pastoralist knowledge with contemporary climate science and climate-smart technology.\n"
                "Evidence-based|Our initiatives are grounded in data and learning about what works.\n"
                "Community-driven|Communities participate in environmental governance and own the results.\n"
                "Partnership for scale|We work with government, civil society and development partners.",
    # ── Art. XI – XIII ──
    "roles": "Chairperson|Provides overall strategic leadership; presides over General Assembly and Executive Committee meetings; is the principal spokesperson to government, partners, donors and the public; and promotes unity, accountability and youth leadership.\n"
             "Vice Chairperson|Assists and, when needed, acts for the Chairperson; supports coordination of committees and special assignments; and promotes good governance, compliance and teamwork.\n"
             "Secretary|Keeps all official records and the register of members; prepares notices and minutes of meetings; handles official correspondence; and ensures statutory returns are filed on time.\n"
             "Treasurer|Is custodian of CHIMA’s funds; records all income, makes payments under approved budgets, keeps the books of accounts, reports to the Executive Committee and General Assembly, and ensures financial compliance and accountability.\n"
             "Member at Large|Represents the wider community on the Executive Committee; promotes inclusivity, participation and accountability; supports safeguarding, ethics and community engagement; and links members with the leadership.",
    # ── Art. VII ──
    "eligibility": "Membership is open to residents of Northern Kenya and the Upper Eastern Region who subscribe to CHIMA’s vision, mission and objectives, with priority given to youth, women and pastoralist communities.",
    "membership": "Ordinary Youth Member|Registration KSh 100\n"
                  "Adult Community Member|Registration KSh 200\n"
                  "Group / Pastoral Association|Registration KSh 1,000\n"
                  "Institutional / Partner Member|Registration KSh 5,000\n"
                  "Honorary Member|Non-voting",
    "membership_note": "Annual renewal for all paying categories is KSh 100. Admission follows an official application form, Executive Committee approval and payment of the prescribed fee.",
}

PROGRAMS = [
    ("Environmental Conservation & Ecosystem Restoration", "trees", "Restoring rangelands, riverbanks and woodlands with indigenous species.",
     "We lead community tree nurseries, natural regeneration, grass reseeding and soil-and-water conservation structures that bring degraded drylands back to life.",
     ["Indigenous tree nurseries", "Rangeland reseeding", "Riverbank restoration"]),
    ("Climate Change Adaptation & Resilience", "cloud-sun", "Helping households and groups prepare for and recover from drought.",
     "From early-warning information to drought-tolerant crops and community contingency funds, we build practical resilience at household and community level.",
     ["Early-warning dissemination", "Community adaptation plans", "Drought-smart farming"]),
    ("Sustainable Agriculture & Livelihoods", "sprout", "Climate-smart farming, water harvesting and diversified incomes.",
     "Farmer field schools, kitchen gardens, drip irrigation and value-addition groups help families earn more from less water.",
     ["Farmer field schools", "Water harvesting & drip kits", "Village savings groups"]),
    ("Gender Equality & Social Inclusion", "heart-handshake", "Ensuring women, girls and marginalised groups have a voice and a share.",
     "We champion women’s leadership in natural resource committees and design activities that are accessible to persons with disabilities and minority communities.",
     ["Women’s leadership clubs", "Inclusive planning forums", "Safe spaces for girls"]),
    ("Youth Empowerment & Leadership", "megaphone", "Growing the next generation of environmental champions.",
     "Mentorship, green-enterprise incubation and civic-engagement training that turn young people into confident community leaders.",
     ["Green enterprise incubation", "Mentorship circles", "Youth climate assemblies"]),
    ("Community Development & Capacity Building", "users", "Strengthening groups, skills and local institutions.",
     "We train community groups in governance, financial management and project planning so they can drive their own development.",
     ["Group governance training", "Financial literacy", "Participatory planning"]),
    ("Environmental Education & Awareness", "book-open", "Taking environmental learning to schools, markets and radio.",
     "School eco-clubs, community dialogues, theatre and local-language radio spread practical environmental knowledge.",
     ["School eco-clubs", "Community dialogues", "Vernacular radio shows"]),
    ("Sustainable Natural Resource Management", "droplets", "Fair, community-governed use of water, pasture and forests.",
     "We support grazing committees, water-user associations and community forest groups to agree on and enforce sustainable-use rules.",
     ["Grazing management plans", "Water user associations", "Community forest groups"]),
]

PROJECTS = [
    dict(title="Green Belt Restoration – Isiolo", status="Ongoing", featured=True, location="Isiolo County",
         program="Environmental Conservation & Ecosystem Restoration",
         summary="Community-led restoration of 500 hectares of degraded rangeland using indigenous acacia and grasses.",
         overview="Overgrazing and charcoal burning have left large stretches of rangeland bare. This project brings together grazing committees, youth groups and schools to regenerate the land through nurseries, reseeding and managed rest periods.",
         objectives=["Restore 500 hectares of degraded rangeland", "Establish 6 community tree nurseries", "Train 120 youth as restoration champions"],
         activities=["Seedling production and planting", "Grass reseeding and half-moon bunds", "Grazing rotation agreements", "Community monitoring with tablets"],
         beneficiaries="1,800 households across 6 villages, with a focus on youth and women’s groups.",
         achievements=[{"label": "Trees planted", "value": "42,000"}, {"label": "Hectares under restoration", "value": "310"}, {"label": "Youth trained", "value": "96"}],
         start_date="2024-03", end_date=""),
    dict(title="Water for Resilience – Marsabit", status="Ongoing", featured=True, location="Marsabit County",
         program="Climate Change Adaptation & Resilience",
         summary="Rainwater harvesting, small dams and drip irrigation to keep families productive through dry seasons.",
         overview="Recurrent drought has drained pans and boreholes. With communities we desilt pans, install roof catchments and teach drip irrigation for kitchen gardens.",
         objectives=["Improve year-round water access for 15 villages", "Introduce drought-smart horticulture", "Form 15 water user committees"],
         activities=["Water pan desilting", "Roof catchment tanks at schools", "Drip kit distribution and training", "Committee governance coaching"],
         beneficiaries="2,400 households, 15 schools and 3 health centres.",
         achievements=[{"label": "Water pans rehabilitated", "value": "14"}, {"label": "Households with drip kits", "value": "620"}, {"label": "Committees formed", "value": "15"}],
         start_date="2023-09", end_date=""),
    dict(title="Vijana Green Enterprise Hub", status="Ongoing", featured=True, location="Isiolo County",
         program="Youth Empowerment & Leadership",
         summary="Incubating youth-owned green businesses: tree nurseries, briquettes, beekeeping and solar services.",
         overview="Young people in the drylands face few job options. The hub offers business skills, seed funding and mentorship so they can build enterprises that also protect the environment.",
         objectives=["Support 40 youth-led green enterprises", "Provide business and digital skills training", "Link youth to markets and financing"],
         activities=["Business bootcamps", "Seed grants and mentorship", "Market linkage fairs", "Digital record-keeping training"],
         beneficiaries="400 young people (55% young women).",
         achievements=[{"label": "Enterprises launched", "value": "28"}, {"label": "Jobs created", "value": "140"}, {"label": "Seed grants awarded", "value": "28"}],
         start_date="2024-06", end_date=""),
    dict(title="Eco-Schools & Climate Clubs", status="Completed", featured=False, location="Isiolo & Samburu",
         program="Environmental Education & Awareness",
         summary="School eco-clubs that plant trees, run waste campaigns and teach climate action to children.",
         overview="Working with 24 schools, the project built eco-clubs, school tree nurseries and a teacher training programme on environmental education.",
         objectives=["Establish eco-clubs in 24 schools", "Train 48 teachers", "Plant school woodlots"],
         activities=["Teacher training", "School nurseries", "Inter-school eco competitions"],
         beneficiaries="9,500 learners and 48 teachers.",
         achievements=[{"label": "Schools reached", "value": "24"}, {"label": "Learners reached", "value": "9,500"}, {"label": "Seedlings grown", "value": "18,000"}],
         start_date="2022-02", end_date="2023-12"),
    dict(title="Women in Natural Resource Governance", status="Completed", featured=False, location="Samburu County",
         program="Gender Equality & Social Inclusion",
         summary="Putting women at the table of grazing and water committees through training and mentorship.",
         overview="Women rarely sit on local resource committees. This project trained and mentored women leaders and sensitised male elders and youth.",
         objectives=["Increase women’s committee membership to 40%", "Train 150 women leaders"],
         activities=["Leadership training", "Elders’ dialogues", "Peer mentoring circles"],
         beneficiaries="150 women leaders and 12 community committees.",
         achievements=[{"label": "Women leaders trained", "value": "150"}, {"label": "Committees with 40%+ women", "value": "9"}],
         start_date="2022-05", end_date="2023-10"),
    dict(title="Climate-Smart Farming Field Schools", status="Planned", featured=False, location="Baringo County",
         program="Sustainable Agriculture & Livelihoods",
         summary="Farmer field schools teaching drought-tolerant crops, soil health and small-scale irrigation.",
         overview="Planned for 2027, this project will establish 20 farmer field schools to demonstrate and spread climate-smart practices.",
         objectives=["Establish 20 field schools", "Reach 1,000 farmers", "Increase crop yields by 25%"],
         activities=["Demonstration plots", "Seed fairs", "Peer-to-peer exchange visits"],
         beneficiaries="1,000 smallholder farmers, 60% women.",
         achievements=[], start_date="2027-02", end_date=""),
]

POSTS = [
    ("Youth plant 10,000 seedlings in one weekend", "News", "More than 300 young people joined CHIMA for the biggest tree-planting weekend yet.",
     "Under a bright dryland sun, young people from six villages gathered at dawn to plant indigenous seedlings along degraded grazing land.\n\nThe weekend drive, organised with local schools and grazing committees, planted more than ten thousand seedlings. Elders blessed the sites and shared stories of how the land looked decades ago.\n\n“We are planting for our children,” said one participant."),
    ("From dust to green: Halima’s kitchen garden", "Success Story", "How one drip-irrigation kit changed a family’s food and income.",
     "Halima started with a single drip kit and a small plot behind her home. Within a season, she was harvesting kale, tomatoes and onions even as rains failed.\n\nShe now sells surplus at the weekly market and trains neighbours in the drip method."),
    ("Water pans rehabilitated ahead of the dry season", "Project Update", "Fourteen water pans have been desilted and fenced in Marsabit.",
     "Working with communities and water user committees, CHIMA completed desilting of 14 pans. Fencing and livestock troughs protect water quality and reduce wasted water.\n\nNext: roof catchments at five schools."),
    ("Why indigenous trees beat fast-growers in the drylands", "Article", "A short guide to choosing species that survive and support biodiversity.",
     "Fast-growing exotic trees can drain scarce groundwater. Indigenous acacias, Balanites and Commiphora are adapted to long dry spells, support pollinators and provide fodder.\n\nCHIMA nurseries prioritise native species chosen with local elders."),
    ("Youth Climate Assembly – save the date", "Event", "Join young leaders for a day of dialogue, exhibitions and tree planting.",
     "The annual Youth Climate Assembly brings together young people, county officials and partners.\n\nExpect panel discussions, a green enterprise expo and a community planting session."),
    ("Field report: community monitoring with tablets", "Field Report", "Youth monitors are tracking tree survival using simple digital forms.",
     "Equipped with tablets, trained youth monitors visit planting sites monthly to record survival rates, rainfall and grazing activity. The data feeds community scorecards and helps CHIMA adapt its approach."),
]

ACTIVITIES = [
    ("Community tree planting day", "Tree planting", "2026-10-18", "Isiolo", 320),
    ("Water harvesting training", "Training", "2026-10-02", "Marsabit", 85),
    ("School eco-club launch", "Education", "2026-09-21", "Samburu", 140),
    ("Women’s leadership dialogue", "Community", "2026-09-05", "Samburu", 60),
    ("Green enterprise bootcamp", "Youth", "2026-08-22", "Isiolo", 75),
    ("Radio talk show on drought resilience", "Awareness", "2026-08-10", "Isiolo", 0),
]

STATS = [
    ("Communities reached", 48, "+", "map-pin", "Villages and settlements we work with"),
    ("Youth engaged", 3200, "+", "users", "Young people in activities and leadership programmes"),
    ("Women engaged", 2100, "+", "heart", "Women in groups, trainings and committees"),
    ("Trees planted & restored", 85000, "+", "trees", "Indigenous seedlings planted and regenerated"),
    ("Individuals trained", 4600, "+", "graduation-cap", "Participants in skills and capacity building"),
    ("Awareness initiatives", 120, "+", "megaphone", "Dialogues, school sessions and campaigns"),
    ("Community groups supported", 64, "", "handshake", "Groups with improved governance and skills"),
    ("Partnerships established", 18, "", "link", "Institutional and community partners"),
]

PARTNERS = [
    ("County Government (Sample)", "Government", "Technical and policy collaboration on land restoration."),
    ("Kenya Forest Service (Sample)", "Government", "Seedling support and forest-conservation guidance."),
    ("Dryland Alliance (Sample)", "Development Partner", "Funding partner for rangeland restoration."),
    ("Green Futures Fund (Sample)", "Funder", "Supports youth green enterprises."),
    ("University of the Drylands (Sample)", "Research", "Research and monitoring partnership."),
    ("Pastoralist Women’s Network (Sample)", "Community Network", "Women’s leadership and advocacy."),
]

# The five Executive Committee positions in the constitution (Art. XI 11.3)
LEADERS = [
    ("Name Surname", "Chairperson", "Executive"),
    ("Name Surname", "Vice Chairperson", "Executive"),
    ("Name Surname", "Secretary", "Executive"),
    ("Name Surname", "Treasurer", "Executive"),
    ("Name Surname", "Member at Large", "Executive"),
]

MEDIA = [
    ("Planting day at sunrise", "image", "Tree planting"),
    ("Water pan after desilting", "image", "Water"),
    ("Youth monitoring tree survival", "image", "Monitoring"),
    ("Women’s group training session", "image", "Training"),
    ("Eco-club students with seedlings", "image", "Education"),
    ("Acacia regeneration after one year", "image", "Landscape"),
    ("CHIMA in the field – documentary (sample)", "video", "Documentary"),
    ("Drip irrigation how-to (sample)", "video", "Training"),
    ("CHIMA organisational profile (sample PDF)", "document", "Documents"),
    ("Annual report 2025 (sample PDF)", "document", "Documents"),
]


def seed(app_config):
    if not AdminUser.query.first():
        u = AdminUser(email=app_config.ADMIN_EMAIL.lower(), name="CHIMA Admin")
        u.set_password(app_config.ADMIN_PASSWORD)
        db.session.add(u)

    # Content version 2 = text taken from the CHIMA Constitution 2026. Installs created from the
    # first (generic placeholder) version get upgraded once; later admin edits are never overwritten.
    ver = db.session.get(Setting, "content_version")
    upgrade = bool(db.session.get(Setting, "mission")) and not ver
    for k, v in SETTINGS.items():
        row = db.session.get(Setting, k)
        if not row:
            db.session.add(Setting(key=k, value=v))
        elif upgrade:
            row.value = v
    if not ver:
        db.session.add(Setting(key="content_version", value="2"))
    if upgrade:
        Leader.query.filter_by(name="Name Surname").delete()

    if not Program.query.first():
        for i, (title, icon, summary, desc, hl) in enumerate(PROGRAMS):
            db.session.add(Program(title=title, slug=slugify(title), icon=icon, summary=summary,
                                   description=desc, highlights=hl, sort_order=i))
    if not Project.query.first():
        for p in PROJECTS:
            db.session.add(Project(slug=slugify(p["title"]), gallery=[], video_url="", cover_url="", **p))
    if not Post.query.first():
        for i, (title, cat, excerpt, body) in enumerate(POSTS):
            db.session.add(Post(title=title, slug=slugify(title), category=cat, excerpt=excerpt, body=body,
                                gallery=[], published=True, event_date="2026-12-05" if cat == "Event" else ""))
    if not Activity.query.first():
        for t, c, d, loc, n in ACTIVITIES:
            db.session.add(Activity(title=t, category=c, activity_date=d, location=loc, participants=n,
                                    description=f"{t} in {loc}, bringing community members together."))
    if not Stat.query.first():
        for i, (label, val, suf, icon, desc) in enumerate(STATS):
            db.session.add(Stat(label=label, value=val, suffix=suf, icon=icon, description=desc, sort_order=i))
    if not Partner.query.first():
        for n, c, d in PARTNERS:
            db.session.add(Partner(name=n, category=c, description=d, collaboration=d))
    if not Leader.query.first():
        for i, (n, r, g) in enumerate(LEADERS):
            db.session.add(Leader(name=n, role=r, group=g, sort_order=i,
                                  bio="Add this executive member’s biography from the admin dashboard."))
    if not MediaItem.query.first():
        for t, k, c in MEDIA:
            db.session.add(MediaItem(title=t, kind=k, category=c, caption="Sample media – replace from admin."))
    db.session.commit()
