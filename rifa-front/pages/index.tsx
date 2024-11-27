import {getStrapiData} from '@/lib/requests';
import {ServerSideContext} from '@/types/index';
import {HomeProps} from '@/types/home';
import Custom500 from '@/pages/500';
import {useMemo} from 'react';
import {
  parseHomeData,
  parsePlansData,
  parseWeeklyAwardsData,
  parseMainAwardsData,
} from '@/lib/functions';
import Introduction from '@/components/Landing/Introduction';
import MainAwards from '@/components/Landing/MainAwards';
import HomeBanner from '@/components/Landing//HomeBanner';
import WeeklyAwards from '@/components/Landing/WeeklyAwards';
import Steps from '@/components/Landing/Steps';
import PlansIntroduction from '@/components/Landing/PlansIntroduction';
import ExclusiveBenefits from '@/components/Landing/ExclusiveBenefits';
import AboutUs from '@/components/Landing/AboutUs';
import LandingLayout from '@/components/Layout/LandingLayout';

const HomePage = ({attributes}: HomeProps) => {
  const {
    seo,
    homeBanner,
    introduction,
    mainAwards,
    weeklyAwards,
    steps,
    plansIntroduction,
    exclusiveBenefits,
    aboutUs,
  } = useMemo(() => parseHomeData(attributes?.homeAttributes), [attributes]);

  const {monthlyPlan, annualPlan} = useMemo(
    () => parsePlansData(attributes?.plansAttributes),
    [attributes]
  );

  const {weeklyAwardsImages} = useMemo(
    () => parseWeeklyAwardsData(attributes?.weeklyAwardsAttributes),
    [attributes]
  );

  const {mainAwardsImages} = useMemo(
    () => parseMainAwardsData(attributes?.mainAwardsAttributes),
    [attributes]
  );
  if (!attributes) return <Custom500 />;
  const components = [
    {component: <HomeBanner data={homeBanner} />, weight: homeBanner?.weight},
    {component: <Introduction data={introduction} />, weight: introduction?.weight},
    {
      component: <WeeklyAwards data={weeklyAwards} weeklyImages={weeklyAwardsImages} />,
      weight: weeklyAwards?.weight,
    },
    {
      component: <MainAwards data={mainAwards} mainAwardsImages={mainAwardsImages} />,
      weight: mainAwards?.weight,
    },
    {component: <Steps data={steps} />, weight: steps?.weight},
    {component: <ExclusiveBenefits data={exclusiveBenefits} />, weight: exclusiveBenefits?.weight},
    {component: <AboutUs data={aboutUs} />, weight: aboutUs?.weight},
    {
      component: (
        <PlansIntroduction
          data={plansIntroduction}
          annualPlan={annualPlan}
          monthlyPlan={monthlyPlan}
        />
      ),
      weight: plansIntroduction?.weight,
    },
  ];
  const sortedComponents = components
    .filter(({weight}) => weight !== undefined && weight !== null) // Ensure the component has a weight
    .sort((a, b) => {
      const weightA = a.weight ?? Number.MAX_SAFE_INTEGER;
      const weightB = b.weight ?? Number.MAX_SAFE_INTEGER;
      return weightA - weightB;
    });

  return (
    <LandingLayout seo={seo}>
      {sortedComponents.map(({component}, index) => (
        <div key={index}>{component}</div>
      ))}
    </LandingLayout>
  );
};

export async function getServerSideProps(context: ServerSideContext) {
  const [homeData, plansData, weeklyAwardsData, mainAwardsData] = await Promise.all([
    getStrapiData('home'),
    getStrapiData('plans'),
    getStrapiData('weekly-awards'),
    getStrapiData('main-awards'),
  ]);

  return {
    props: {
      attributes: {
        homeAttributes: homeData?.data?.attributes || null,
        plansAttributes: plansData?.data || null,
        weeklyAwardsAttributes: weeklyAwardsData?.data || null,
        mainAwardsAttributes: mainAwardsData?.data || null,
      },
    },
  };
}

export default HomePage;
