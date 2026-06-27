import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { CourseGrid } from '@/components/CourseGrid';
import { Articles } from '@/components/Articles';
import { Why } from '@/components/Why';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';
import { DonatePopup } from '@/components/DonatePopup';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CourseGrid />
        <Articles />
        <Why />
        <FAQ />
      </main>
      <Footer />
      <DonatePopup />
    </>
  );
}
