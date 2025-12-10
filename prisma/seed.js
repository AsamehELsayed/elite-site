const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') || null

// Set DATABASE_URL if not set and using SQLite
if (!process.env.DATABASE_URL) {
  const schemaPath = path.join(__dirname, 'schema.prisma')
  if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf8')
    if (schema.includes('provider = "sqlite"')) {
      process.env.DATABASE_URL = 'file:./dev.db'
      console.log('💡 DATABASE_URL not set, using default: file:./dev.db')
    }
  }
}

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const existingAdmin = await prisma.user.findUnique({ 
    where: { email: 'admin@elite.com' } 
  })
  
  if (existingAdmin) {
    console.log('ℹ️  Admin user already exists, skipping creation')
  } else {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@elite.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin'
      }
    })
    console.log('✅ Admin user created:', admin.email)
  }

  // Clear existing data
  await prisma.testimonial.deleteMany()
  await prisma.caseStudy.deleteMany()
  await prisma.stat.deleteMany()
  await prisma.contactBooking.deleteMany()
  await prisma.philosophy.deleteMany()
  await prisma.hero.deleteMany()
  await prisma.header.deleteMany()
  await prisma.footer.deleteMany()
  await prisma.legal.deleteMany()
  await prisma.services.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.visual.deleteMany()

  // Seed Testimonials
  const testimonials = [
    {
      quote: "<p><strong>Elite</strong> made our private banking launch feel like a cinematic premiere.</p><p>Conversion jumped <strong>146%</strong> without any paid push.</p>",
      author: "Nadia Farrow",
      role: "Global Brand VP — Orion Private",
      city: "Dubai",
      metrics: ["+146% launch conv.", "3 week rollout"],
      order: 0
    },
    {
      quote: "<p>They choreographed an entire digital universe for our couture drops.</p><p>Clients now queue online like it's <em>Paris Fashion Week</em>.</p>",
      author: "Lucien Marche",
      role: "Creative Director — Maison Marche",
      city: "Paris",
      metrics: ["83% repeat rate", "$4.2M first drop"],
      order: 1
    },
    {
      quote: "<p>Elite rebuilt the way UHNW families discover our properties.</p><p><strong>Leads doubled</strong> and every visit feels hand-crafted.</p>",
      author: "Viola Ren",
      role: "Managing Partner — Ren Capital Estates",
      city: "Singapore",
      metrics: ["2.1x qualified leads", "6 markets synced"],
      order: 2
    },
    {
      quote: "<p>Their sensory, editorial approach to experiential travel made our bookings surge</p><p>while keeping the brand <strong>impossibly rare</strong>.</p>",
      author: "Sora Ahn",
      role: "Founder — Nine Horizons",
      city: "Seoul",
      metrics: ["62% avg. cart uplift", "NPS 92"],
      order: 3
    }
  ]

  for (const testimonial of testimonials) {
    await prisma.testimonial.create({
      data: {
        ...testimonial,
        metrics: JSON.stringify(testimonial.metrics),
        translations: {
          ar: {
            quote: "<p>جعلت <strong>إيليت</strong> إطلاقنا المصرفي الخاص أشبه بعرض سينمائي.</p><p>ارتفعت التحويلات بنسبة <strong>146٪</strong> بدون أي حملات مدفوعة.</p>",
            author: "ناديا فارو",
            role: "نائب الرئيس للعلامة التجارية — أوريون برايفت",
            city: "دبي",
            metrics: JSON.stringify(testimonial.metrics)
          }
        }
      }
    })
  }
  console.log(`✅ Created ${testimonials.length} testimonials`)

  // Seed Header (nav, social, gallery)
  const headerNavLinks = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "/services" },
    { name: "Portfolio", href: "#work" },
    { name: "Contact Us", href: "#contact" }
  ]
  const headerServiceLinks = [
    "Web Development",
    "Mobile App",
    "Branding",
    "Social Media Management",
    "Google Adword",
    "Media Production"
  ]
  const headerSocialLinks = [
    { platform: "Facebook", url: "#" },
    { platform: "Instagram", url: "#" },
    { platform: "Twitter", url: "#" }
  ]
  const headerGallery = [
    { src: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=800&q=80", caption: "Creative Studio" },
    { src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80", caption: "Digital Lab" },
    { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", caption: "Brand Session" },
    { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80", caption: "Campaign Hub" },
  ]
  await prisma.header.create({
    data: {
      companyName: "ELITE.",
      navLinks: JSON.stringify(headerNavLinks),
      serviceLinks: JSON.stringify(headerServiceLinks),
      phone: "+201009957000",
      email: "info@be-group.com",
      socialLinks: JSON.stringify(headerSocialLinks),
      galleryImages: JSON.stringify(headerGallery),
      sinceYear: "20",
      footerText: "Market Reference",
      translations: {
        ar: {
          companyName: "إيليت.",
          navLinks: JSON.stringify([
            { name: "الرئيسية", href: "#home" },
            { name: "الخدمات", href: "/services" },
            { name: "الأعمال", href: "#work" },
            { name: "اتصل بنا", href: "#contact" }
          ]),
          serviceLinks: JSON.stringify([
            "تطوير الويب",
            "تطبيقات الجوال",
            "الهوية البصرية",
            "إدارة التواصل الاجتماعي",
            "إعلانات جوجل",
            "الإنتاج الإعلامي"
          ]),
          phone: "+201009957000",
          email: "info@be-group.com",
          socialLinks: JSON.stringify(headerSocialLinks),
          galleryImages: JSON.stringify(headerGallery),
          sinceYear: "20",
          footerText: "مرجع السوق"
        }
      }
    }
  })
  console.log('✅ Created header')

  // Seed Footer
  const footerSocial = [
    { icon: "Instagram", href: "#", label: "Instagram" },
    { icon: "Linkedin", href: "#", label: "LinkedIn" },
    { icon: "Twitter", href: "#", label: "Twitter" },
    { icon: "Facebook", href: "#", label: "Facebook" }
  ]
  const footerServices = [
    "Strategic Consulting",
    "Social Media Management",
    "Paid Advertising",
    "Public Relations",
    "Content Creation"
  ]
  const footerCompany = [
    "About Us",
    "Our Team",
    "Careers",
    "Case Studies",
    "Contact"
  ]
  await prisma.footer.create({
    data: {
      companyName: "ELITE.",
      companyDescription: "<p>A premium digital marketing agency dedicated to elevating brands through <strong>strategy</strong>, creativity, and innovation.</p>",
      socialLinks: JSON.stringify(footerSocial),
      servicesLinks: JSON.stringify(footerServices),
      companyLinks: JSON.stringify(footerCompany),
      newsletterTitle: "Newsletter",
      newsletterDescription: "<p><strong>Subscribe</strong> for the latest insights, drops, and launch playbooks.</p>",
      copyrightText: "© 2025 Elite Agency. All rights reserved.",
      privacyPolicyLink: "/privacy",
      termsOfServiceLink: "/terms",
      translations: {
        ar: {
          companyName: "إيليت.",
          companyDescription: "<p>وكالة تسويق رقمي فاخرة ترفع العلامات التجارية عبر <strong>الإستراتيجية</strong> والإبداع والابتكار.</p>",
          socialLinks: JSON.stringify(footerSocial),
          servicesLinks: JSON.stringify([
            "استشارات استراتيجية",
            "إدارة التواصل الاجتماعي",
            "الإعلانات المدفوعة",
            "العلاقات العامة",
            "إنشاء المحتوى"
          ]),
          companyLinks: JSON.stringify([
            "من نحن",
            "فريقنا",
            "الوظائف",
            "دراسات الحالة",
            "اتصل بنا"
          ]),
          newsletterTitle: "النشرة البريدية",
          newsletterDescription: "<p><strong>اشترك</strong> لتصلك أحدث الرؤى والإصدارات وخطط الإطلاق.</p>",
          copyrightText: "© 2025 وكالة إيليت. جميع الحقوق محفوظة.",
          privacyPolicyLink: "/privacy",
          termsOfServiceLink: "/terms"
        }
      }
    }
  })
  console.log('✅ Created footer')

  // Seed Legal (Privacy & Terms)
  await prisma.legal.create({
    data: {
      privacyTitle: "Privacy Policy",
      privacyContent:
        "<p>We collect only the information required to deliver our services, improve site performance, and personalize experiences. Data is processed lawfully and stored securely with limited access.</p><p>You may request access, correction, or deletion of your data at any time.</p>",
      termsTitle: "Terms & Conditions",
      termsContent:
        "<p>Use of this site constitutes acceptance of these Terms. Content is provided for informational purposes, and we reserve the right to modify offerings at any time.</p><p>All trademarks, assets, and creative materials remain the property of Elite unless otherwise noted.</p>",
      translations: {
        ar: {
          privacyTitle: "سياسة الخصوصية",
          privacyContent:
            "<p>نقوم بجمع المعلومات اللازمة فقط لتقديم خدماتنا وتحسين الأداء وتخصيص التجربة. تتم معالجة البيانات بشكل قانوني وتخزينها بأمان مع وصول محدود.</p><p>يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها في أي وقت.</p>",
          termsTitle: "الشروط والأحكام",
          termsContent:
            "<p>استخدامك لهذا الموقع يعني موافقتك على هذه الشروط. يتم تقديم المحتوى لأغراض معلوماتية، ونحتفظ بالحق في تعديل العروض في أي وقت.</p><p>جميع العلامات التجارية والأصول والمواد الإبداعية تظل ملكًا لإيليت ما لم يُذكر خلاف ذلك.</p>",
        },
      },
    },
  })
  console.log('✅ Created legal content')

  // Seed Services
  const servicesList = [
    {
      id: "01",
      title: "Brand Identity",
      description: "<p>Crafting visual systems that speak without words.</p><p><strong>Logos, palettes, and typography</strong> tuned for luxury.</p>",
      icon: "Palette",
      iconType: "preset"
    },
    {
      id: "02",
      title: "Digital Experience",
      description: "<p>Immersive web and mobile solutions for the modern age.</p><ul><li>High-velocity landing systems</li><li>Premium commerce flows</li></ul>",
      icon: "Globe",
      iconType: "preset"
    },
    {
      id: "03",
      title: "Content Strategy",
      description: "<p>Narratives that engage, convert, and retain.</p><p><em>Editorial-grade</em> storytelling at scale.</p>",
      icon: "FileText",
      iconType: "preset"
    },
    {
      id: "04",
      title: "Growth Marketing",
      description: "<p>Data-driven campaigns for scalable success.</p><p>Signals, cohorts, and <strong>ROI clarity</strong>.</p>",
      icon: "TrendingUp",
      iconType: "preset"
    }
  ]
  await prisma.services.create({
    data: {
      sectionTitle: "Comprehensive Solutions",
      sectionSubtitle: "Our Expertise",
      services: JSON.stringify(servicesList),
      translations: {
        ar: {
          sectionTitle: "حلول متكاملة",
          sectionSubtitle: "خبراتنا",
          services: JSON.stringify([
            { ...servicesList[0], title: "الهوية البصرية", description: "<p>أنظمة بصرية تعبّر بصمت.</p><p><strong>شعارات وألوان وخطوط</strong> مضبوطة للفخامة.</p>" },
            { ...servicesList[1], title: "التجارب الرقمية", description: "<p>تجارب ويب وموبايل غامرة للعصر الحديث.</p><ul><li>منظومات صفحات سريعة</li><li>تجارب تجارة فاخرة</li></ul>" },
            { ...servicesList[2], title: "استراتيجية المحتوى", description: "<p>سرديات تجذب وتحوّل وتحتفظ بالعملاء.</p><p><em>سرد تحريري</em> على نطاق واسع.</p>" },
            { ...servicesList[3], title: "تسويق النمو", description: "<p>حملات مدفوعة بالبيانات لتحقيق نمو قابل للتوسع.</p><p>إشارات، شرائح، و<strong>وضوح العائد</strong>.</p>" },
          ])
        }
      }
    }
  })
  console.log('✅ Created services')

  // Seed Case Studies
  const caseStudies = [
    {
      title: "Lumina Fashion",
      category: "E-Commerce",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      year: "2024",
      description: "<p>A modern e-commerce platform revolutionizing the fashion retail experience.</p><ul><li>Immersive lookbooks</li><li>Clienteling checkout</li><li>Adaptive merchandising</li></ul>",
      link: "https://google.com/",
      order: 0
    },
    {
      title: "Apex Architecture",
      category: "Branding",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
      year: "2024",
      description: "<p>Brand identity design for a leading architecture firm.</p><p><strong>Monolithic wordmark</strong> and tactile print system.</p>",
      link: "https://google.com/",
      order: 1
    },
    {
      title: "Velvet Interiors",
      category: "Web Design",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      year: "2023",
      description: "<p>Luxury interior design showcase with immersive 3D experiences.</p><p>Shoppable editorials and <em>guided tours</em>.</p>",
      link: "https://google.com/",
      order: 2
    }
  ]

  for (const caseStudy of caseStudies) {
    await prisma.caseStudy.create({
      data: {
        ...caseStudy,
        slug: slugify(caseStudy.title),
        translations: {
          ar: {
            title: "لومينا فاشن",
            category: "تجارة إلكترونية",
            description: "<p>منصة تسوق عصرية تعيد ابتكار تجربة البيع بالتجزئة للموضة.</p><ul><li>كتالوجات غامرة</li><li>دفع بخبرة العملاء</li><li>تسويق متكيّف</li></ul>",
            link: caseStudy.link
          }
        }
      }
    })
  }
  console.log(`✅ Created ${caseStudies.length} case studies`)

  // Seed Stats
  const stats = [
    {
      label: "Ultra-luxury launches activated",
      value: "38",
      order: 0
    },
    {
      label: "Average uplift in premium conversions",
      value: "212%",
      order: 1
    },
    {
      label: "Markets scaling same-day experiences",
      value: "11",
      order: 2
    }
  ]

  for (const stat of stats) {
    await prisma.stat.create({
      data: {
        ...stat,
        translations: {
          ar: {
            label: stat.label === "Ultra-luxury launches activated"
              ? "إطلاقات فائقة الفخامة تم تفعيلها"
              : stat.label === "Average uplift in premium conversions"
                ? "متوسط نمو التحويلات المميزة"
                : "أسواق توسع تجارب اليوم نفسه",
            value: stat.value
          }
        }
      }
    })
  }
  console.log(`✅ Created ${stats.length} stats`)

  // Seed Contact Bookings
  const contactBookings = [
    {
      day: "Mon",
      date: "May 05",
      slots: ["09:00", "11:30", "15:00"],
      order: 0
    },
    {
      day: "Tue",
      date: "May 06",
      slots: ["10:00", "13:30", "17:00"],
      order: 1
    },
    {
      day: "Wed",
      date: "May 07",
      slots: ["08:30", "12:00", "16:30"],
      order: 2
    },
    {
      day: "Thu",
      date: "May 08",
      slots: ["09:30", "14:00"],
      order: 3
    },
    {
      day: "Fri",
      date: "May 09",
      slots: ["10:30", "13:00", "18:00"],
      order: 4
    }
  ]

  for (const booking of contactBookings) {
    await prisma.contactBooking.create({
      data: {
        ...booking,
        slots: JSON.stringify(booking.slots),
        translations: {
          ar: {
            day: booking.day,
            date: booking.date,
            slots: JSON.stringify(booking.slots)
          }
        }
      }
    })
  }
  console.log(`✅ Created ${contactBookings.length} contact bookings`)

  // Seed Philosophy
  const existingPhilosophy = await prisma.philosophy.findFirst()
  if (!existingPhilosophy) {
    await prisma.philosophy.create({
      data: {
        title: "Our Philosophy",
        content: "<p>We craft digital experiences that resonate with luxury brands and high-net-worth audiences.</p><p>Every pixel, every interaction, every moment is designed to elevate your brand and drive meaningful connections.</p><ul><li>Obsessive craft</li><li>Measured outcomes</li><li>Human stories</li></ul>",
        translations: {
          ar: {
            title: "فلسفتنا",
            content: "<p>نصنع تجارب رقمية تتناغم مع العلامات الفاخرة وأصحاب الثروات العالية.</p><p>كل بكسل وكل تفاعل وكل لحظة مصممة لرفع علامتك ودفع روابط مؤثرة.</p><ul><li>حرفة دقيقة</li><li>نتائج مقاسة</li><li>قصص إنسانية</li></ul>"
          }
        }
      }
    })
    console.log('✅ Created philosophy content')
  } else {
    console.log('ℹ️  Philosophy content already exists')
  }

  // Seed Hero (upsert translations if record exists without them)
  const existingHero = await prisma.hero.findFirst()
  const heroBase = {
    title: "Elite",
    subtitle: "Premium Digital Marketing Agency",
    description: "<p>We craft digital experiences that resonate with luxury brands and <strong>high-net-worth audiences</strong>.</p>",
    ctaText: "Get Started",
    ctaLink: "#contact",
  }
  const heroTranslations = {
    ar: {
      title: "إيليت",
      subtitle: "وكالة تسويق رقمي متميزة",
      description: "<p>نصنع تجارب رقمية تتناغم مع العلامات الفاخرة وأصحاب <strong>الثروات العالية</strong>.</p>",
      ctaText: "ابدأ الآن",
      ctaLink: "#contact"
    }
  }

  if (!existingHero) {
    await prisma.hero.create({
      data: {
        ...heroBase,
        translations: heroTranslations,
      }
    })
    console.log('✅ Created hero content')
  } else {
    // Ensure Arabic translations are present/updated without overwriting other locales
    const mergedTranslations = {
      ...(existingHero.translations || {}),
      ...heroTranslations,
    }
    await prisma.hero.update({
      where: { id: existingHero.id },
      data: {
        translations: mergedTranslations,
        // Only backfill base fields if they are null/empty to avoid overwriting edits
        ...(['title','subtitle','description','ctaText','ctaLink'].reduce((acc, key) => {
          if (!existingHero[key]) acc[key] = heroBase[key]
          return acc
        }, {}))
      }
    })
    console.log('ℹ️  Hero content updated with Arabic translations')
  }

  // Seed Contact content
  const contactBriefing = [
    { title: "Discovery", detail: "Clarify goals, constraints & timing." },
    { title: "Strategy sprint", detail: "Design the activation blueprint." },
    { title: "Green light", detail: "Lock scope, squad, and success metrics." }
  ]
  const contactFocus = [
    "Align on launch objectives, runways, and desired KPIs.",
    "Review available squads, budget bands, and timelines.",
    "Leave with a clear decision memo and next steps."
  ]
  const contactSlots = {
    week: [
      { day: "Mon", date: "May 05", slots: ["09:00", "11:30", "15:00"] },
      { day: "Tue", date: "May 06", slots: ["10:00", "13:30", "17:00"] },
      { day: "Wed", date: "May 07", slots: ["08:30", "12:00", "16:30"] },
      { day: "Thu", date: "May 08", slots: ["09:30", "14:00"] },
      { day: "Fri", date: "May 09", slots: ["10:30", "13:00", "18:00"] },
    ]
  }
  await prisma.contact.create({
    data: {
      sectionTitle: "Reserve a calendar slot with our leadership team",
      sectionDescription: "<p>Choose a window that suits your cadence and we'll arrive with a tailored agenda.</p><p><strong>Expect</strong> a focused 45-minute working session.</p>",
      briefingSteps: JSON.stringify(contactBriefing),
      sessionFocus: JSON.stringify(contactFocus),
      bookingEmail: "studio@elite.com",
      bookingSlots: JSON.stringify(contactSlots),
      translations: {
        ar: {
          sectionTitle: "احجز موعداً مع فريق القيادة",
          sectionDescription: "<p>اختر وقتاً يناسبك وسنحضر بأجندة مخصصة.</p><p><strong>توقّع</strong> جلسة عمل مركّزة لمدة 45 دقيقة.</p>",
          briefingSteps: JSON.stringify([
            { title: "اكتشاف", detail: "توضيح الأهداف والقيود والجداول." },
            { title: "سباق الاستراتيجية", detail: "تصميم مخطط التفعيل." },
            { title: "الانطلاقة", detail: "تثبيت النطاق والفريق ومعايير النجاح." }
          ]),
          sessionFocus: JSON.stringify([
            "مواءمة أهداف الإطلاق ومؤشرات الأداء.",
            "مراجعة الفرق والميزانيات والجداول الزمنية.",
            "الخروج بمذكرة قرار واضحة وخطوات تالية."
          ]),
          bookingEmail: "studio@elite.com",
          bookingSlots: JSON.stringify(contactSlots)
        }
      }
    }
  })
  console.log('✅ Created contact content')

  // Seed Visuals
  const gallery1Images = [
    { src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop", skew: "-skew-x-12" },
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop", skew: "skew-x-12" },
    { src: "https://images.unsplash.com/photo-1635776063043-ab23b4c226f6?w=500&auto=format&fit=crop", skew: "-skew-x-12" },
    { src: "https://images.unsplash.com/photo-1618004652321-13a63e576b80?w=500&auto=format&fit=crop", skew: "skew-x-12" },
  ]
  const gallery2Images = [
    { src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=500&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=500&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop" },
    { src: "https://images.unsplash.com/photo-1635776063043-ab23b4c226f6?w=500&auto=format&fit=crop" },
  ]
  await prisma.visual.create({
    data: {
      section1Title: "Discover What Makes Us",
      section1Highlight: "Truly Elite 👇",
      section2Title: "We don't just create designs, We craft",
      section2Highlight: "Digital Experiences 💼",
      section3Title: "Every Project Tells A",
      section3Highlight: "Success Story 😎",
      section4Title: "Witness The Power Of",
      section4Highlight: "Elite Design ☝️",
      section5Title: "We Turn Your Vision Into",
      section5Highlight: "Stunning Reality 😎",
      gallery1Images: JSON.stringify(gallery1Images),
      gallery2Images: JSON.stringify(gallery2Images),
      translations: {
        ar: {
          section1Title: "اكتشف ما يميزنا",
          section1Highlight: "إيليت بحق 👇",
          section2Title: "نحن لا نصمم فقط، بل نصنع",
          section2Highlight: "تجارب رقمية 💼",
          section3Title: "كل مشروع يروي",
          section3Highlight: "قصة نجاح 😎",
          section4Title: "شاهد قوة",
          section4Highlight: "تصميم إيليت ☝️",
          section5Title: "نحوّل رؤيتك إلى",
          section5Highlight: "واقع مذهل 😎",
          gallery1Images: JSON.stringify(gallery1Images),
          gallery2Images: JSON.stringify(gallery2Images),
        }
      }
    }
  })
  console.log('✅ Created visuals content')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

