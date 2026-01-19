import dynamic from 'next/dynamic';
import { TenantName } from '../../../utils/app.constant';

export function generateMetadata({
  searchParams: { program },
}: {
  searchParams: { program: string };
}) {
  const titles = {
    "Second Chance": TenantName.SECOND_CHANCE_PROGRAM,
    'Vocational Training': 'Vocational Training',
  };

  const descriptions = {
      "Second Chance": `The ${TenantName.SECOND_CHANCE_PROGRAM} by Pratham is a powerful initiative that helps young girls and women who dropped out of school complete their Grade 10 education. By bringing learning closer to home and offering the support they need, the program breaks barriers like early marriage, household responsibilities, and lack of access. It opens doors to higher education, skills training, and better job opportunities, giving women a real shot at a brighter future.`,
    'Vocational Training': `Pratham's Vocational Skilling Program, launched in 2005, empowers youth from underprivileged backgrounds by equipping them with practical, job-ready skills. With a presence across India, it opens doors to employment in over 10 key sectors, supported by affiliations like NSDC. In response to changing times, the program evolved into a Hybrid Skilling model, blending digital tools with training to help young people thrive in a post-pandemic world.`,
  };

  const title =
    (titles as Record<string, string>)[program] || 'Learning for Life';
  const description =
    (descriptions as Record<string, string>)[program] ||
    `Learning for Life encompasses skills and knowledge that are a part of lifelong learning like transferable skills, interests, hobbies, and creativity. These also include life skills but are not limited to them.  It emphasises environmental awareness, physical and mental well-being, and extends learning beyond scholastic subjects.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `/images/pos_program.jpg`,
          width: 800,
          height: 600,
        },
      ],
      type: 'website',
    },
  };
}

const List = dynamic(() => import('@learner/components/pos/List'), {
  ssr: false,
});

export default function PosPage() {
  return (
    <List
      pagename={{
        'Vocational Training': TenantName.YOUTHNET,
        "Second Chance": TenantName.SECOND_CHANCE_PROGRAM,
        'Creativity Club': TenantName.CREATIVITY_CLUB,
        'Early Childhood Education': TenantName.EARLY_CHILDHOOD_EDUCATION,
        'Inclusive Education (ENABLE)': TenantName.INCLUSIVE_EDUCATION,
        'Elementary': TenantName.ELEMENTARY,
        'Annual Status of Education Report': TenantName.ANNUAL_STATUS_OF_EDUCATION_REPORT,
      }}
      _content={{
        contentTabs: ['content'],
        isOpenColapsed: ['contentLanguage', 'se_domains', 'se_subDomains', 'se_subjects'],
      }}
      _infoCard={{
        item: {
          description: {
            "Second Chance": `The ${TenantName.SECOND_CHANCE_PROGRAM} by Pratham is a powerful initiative that helps young girls and women who dropped out of school complete their Grade 10 education. By bringing learning closer to home and offering the support they need, the program breaks barriers like early marriage, household responsibilities, and lack of access. It opens doors to higher education, skills training, and better job opportunities, giving women a real shot at a brighter future.`,
            'Vocational Training':
              'Pratham\'s Vocational Skilling Program, launched in 2005, empowers youth from underprivileged backgrounds by equipping them with practical, job-ready skills. With a presence across India, it opens doors to employment in over 10 key sectors, supported by affiliations like NSDC. In response to changing times, the program evolved into a Hybrid Skilling model, blending digital tools with training to help young people thrive in a post-pandemic world.',
              "Creativity Club": `Pratham’s Creativity Club Program engages children (ages 10-14) and youth (ages 14+) across diverse domains such as STEM, visual and performing arts, environment, and sports. The program fosters essential 21st-century skills such as creativity, problem-solving, communication, and collaboration. Through its 'all-some-few' approach, the program provides tailored opportunities that match individual interests, supported by digital and social infrastructure.'`,
              "Early Childhood Education": `Pratham’s work with Early Childhood Education began in 1995  with  balwadis in Mumbai, run by community-based volunteers. Since then, our early years interventions, focusing on holistic development and learning of children of 0-8 years, have evolved considerably through years of experimentation with different content, material, and delivery models. These programs use play-based pedagogy, local resources, low-cost and appropriate material, and involve caregivers, especially mothers. 

Providing appropriate care and nurturing to children in their early and formative years is therefore critical for ensuring optimal growth and development. India’s New Education Policy (NEP 2020) underscores this crucial importance of Early Childhood Care and Education (ECCE) and Foundational Literacy and Numeracy (FLN). In this evolving landscape, Pratham continues to invest heavily in expanding and exploring how to impact children’s holistic development and foundational abilities during these early years. Pratham believes that building strong foundational abilities in children during their early years will make them effective learners and eliminate the need for remedial interventions in the later years.`,
              "Inclusive Education (ENABLE)": `(Equity in Accessing Numeracy and Basic Literacy Education) is an initiative of Pratham to strengthen inclusive care and education, with a focus on children with disabilities.
Acquiring foundational skills in the early years is critical for children to be ready for future curricular expectations and to pursue lifelong learning. While all children have varying degrees of vulnerabilities, children with disabilities disproportionately face significant systemic, socio-economic, and cultural barriers, putting them at great risk of being left behind in acquiring foundational skills.
Over 85% of a child’s cumulative brain development occurs before the age of six. Providing appropriate care and nurturing to children in their early and formative years is therefore critical for subsequent growth and development. A significant proportion of disabilities are preventable if developmental delays are detected early and appropriate action is taken in a timely manner.`,
              "Elementary": `More than 95% of 6-14 year-old children in India are enrolled in schools. However, ASER and other surveys show that a significant proportion of these children complete primary schooling without acquiring foundational reading and arithmetic skills, and therefore, are unable to cope with subsequent curricular expectations. One of Pratham’s key goals is to enable such children acquire basic reading and arithmetic skills, quickly and sustainably, so that they can meaningfully benefit from further education opportunities.

Pratham has developed the CAMaL pedagogy, which stands for Combined Activities for Maximised Learning, to help children “catch up”. CAMaL is a child-centered pedagogy that builds on the Teaching at the Right Level (TaRL) approach, pioneered by Pratham, that uses instructions and activities tailored and aligned to the learning level of the child.


At Pratham, we believe that a combination of activities helps children engage and learn. For example, reading aloud, participating in discussions on what they have read or heard, activities with phonetic charts, playing a variety of word games, expressing their own views orally and on paper – are all part of the process of learning to read. We do activities with children in large groups, small groups and individually`,
              "Annual Status of Education Report": `ASER Centre is the measurement, assessment, and research unit of Pratham Education Foundation. The unit uses simple yet rigorous methods to generate evidence at scale on the impact of social sector programs and policies, focusing mainly on the education sector. More info: https://asercentre.org/
`
          },
        },
      }}
    />
  );
}
