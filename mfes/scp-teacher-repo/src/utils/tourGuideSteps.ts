import { TFunction } from 'next-i18next';
export const getSteps = (t: TFunction) => [
  {
    target: 'joyride-step-0',
    content: t('GUIDE_TOUR.STEP_0'),
  },
  {
    target: '.joyride-step-1',
    content: t('GUIDE_TOUR.STEP_1'),
  },
  {
    target: '.joyride-step-2',
    content: t('GUIDE_TOUR.STEP_2'),
    placement: 'bottom-start' as 'bottom',
  },
  {
    target: '.joyride-step-3',
    content: t('GUIDE_TOUR.STEP_3'),
  },
  {
    target: '.joyride-step-4',
    content: t('GUIDE_TOUR.STEP_4'),
  },
  {
    target: '.joyride-step-5',
    content: t('GUIDE_TOUR.STEP_5'),
  },
  {
    target: '.joyride-step-6',
    content: t('GUIDE_TOUR.STEP_6'),
  },
  {
    target: '.joyride-step-7',
    content: t('GUIDE_TOUR.STEP_7'),
  },
  {
    target: '.joyride-step-8',
    content: t('GUIDE_TOUR.STEP_8'),
  },
  {
    target: '.joyride-step-9',
    content: t('GUIDE_TOUR.STEP_9'),
  },
  {
    target: '.joyride-step-10',
    content: t('GUIDE_TOUR.STEP_10'),
  },
  {
    target: '.joyride-step-11',
    content: t('GUIDE_TOUR.STEP_11'),
  },
  {
    target: '.joyride-step-12',
    content: t('GUIDE_TOUR.STEP_12'),
  },
];
