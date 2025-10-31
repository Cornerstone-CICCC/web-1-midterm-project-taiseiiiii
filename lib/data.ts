export const personalInfo = {
  name: {
    en: "Taisei Miyazaki",
    ja: "宮崎 泰成",
  },
  title: {
    en: "Full Stack Software Developer",
    ja: "シニアソフトウェアエンジニア",
  },
  lead: {
    en: "With over 5 years of experience, I build elegant, scalable software. My expertise spans a wide variety of fields, from web to mobile development, with a focus on React, Flutter, and Java.",
    ja: "5年以上の経験を持つエレガントでスケーラブルなソフトウェア開発者です。Webからモバイルまで幅広い分野に対応し、React、Flutter、Javaを強みとしています。",
  },
  location: "Vancouver, BC",
  email: "isemiya.0509@gmail.com",
  github: "https://github.com/taiseiiiii",
  linkedin: "https://www.linkedin.com/in/taisei-miyazaki",
  about: {
    en: "Full Stack Software Engineer with 5+ years experience specializing in Flutter, React, and Java. I enjoy architecting systems, mentoring engineers, and contributing to open-source.",
    ja: "Flutter、React、Javaを専門とする5年以上の経験を持つシニアソフトウェアエンジニア。システムアーキテクチャの設計、エンジニアのメンタリング、オープンソースへの貢献を楽しんでいます。",
  },
  contactMessage: {
    en: "I'm open to full-time roles, collaborations, and OSS projects.",
    ja: "フルタイムの仕事、コラボレーション、OSSプロジェクトに興味があります。",
  },
  locationFootnote: {
    en: "Based in Vancouver, Canada 🇨🇦",
    ja: "カナダ・バンクーバー在住 🇨🇦",
  },
};

export const experience = [
  {
    year: "2024/5 - Present",
    company: "evawat Inc.",
    title: {
      en: "Mobile Engineer",
      ja: "モバイルエンジニア",
    },
    description: {
      en: "My responsibilities spanned the full development lifecycle, from establishing CI/CD pipelines to daily feature implementation.",
      ja: "Flutterを用いたモバイル開発を社内唯一のモバイルエンジニアとして一人で対応、CI/CDの構築から日々の開発まで幅広く対応",
    },
  },
  {
    year: "2022/8 - 2025/7",
    company: "Sorich Inc.",
    title: {
      en: "FullStack Developer",
      ja: "フルスタックデベロッパー",
    },
    description: {
      en: "Managed full-stack development across a wide spectrum, from web applications using React to mobile development using Flutter. Regularly led projects from scratch, handling comprehensive architectural design and technical selection.",
      ja: "Reactを用いたWeb開発からFlutterを用いたモバイル開発まで幅広く対応。フルスクラッチでの開発も多く、アーキテクチャ設計や技術選定も務める",
    },
  },
  {
    year: "2020/4 - 2022/7",
    company: "KMK WORLD Inc.",
    title: {
      en: "FullStack Developer",
      ja: "フルスタックデベロッパー",
    },
    description: {
      en: "Engaged in a wide variety of system development projects, ranging from embedded systems to web development. Served as a mentor and instructor for On-the-Job Training (OJT) and coding workshops for new hires and junior developers.",
      ja: "組み込み系からWeb開発まで幅広いシステム開発業務に携わる。メンターとして内定者や新卒のOJTやコーディング研修の講師を務める",
    },
  },
];

export const projects = [
  {
    id: "icon-checkbox",
    title: "icon_checkbox",
    description: {
      en: "A Flutter package that provides customizable icon-based checkboxes with smooth animations and flexible styling options.",
      ja: "スムーズなアニメーションと柔軟なスタイリングオプションを備えた、カスタマイズ可能なアイコンベースのチェックボックスを提供するFlutterパッケージ。",
    },
    tags: ["Flutter", "Dart", "Package", "UI"],
    link: "https://pub.dev/packages/icon_checkbox",
    image: "https://opengraph.githubassets.com/1/taiseiiiii/icon_checkbox",
    type: "package" as const,
  },
  {
    id: "custom-vimeo-player",
    title: "custom_vimeo_player",
    description: {
      en: "A Flutter package for embedding and controlling Vimeo videos with custom controls and advanced playback features.",
      ja: "カスタムコントロールと高度な再生機能を備えたVimeo動画を埋め込み・制御するためのFlutterパッケージ。",
    },
    tags: ["Flutter", "Dart", "Package", "Video"],
    link: "https://pub.dev/packages/custom_vimeo_player",
    image:
      "https://opengraph.githubassets.com/1/taiseiiiii/custom_vimeo_player",
    type: "package" as const,
  },
  {
    id: "yamada-ui",
    title: "Yamada UI",
    description: {
      en: "Open-source React UI component library. Contributing as a core maintainer and handling accessibility and internationalization.",
      ja: "オープンソースReact UIコンポーネントライブラリ。主にアクセシビリティと国際化対応を行い、メンテナーとして貢献。",
    },
    tags: ["React", "TypeScript", "OSS", "a11y"],
    link: "https://github.com/yamada-ui/yamada-ui",
    image: "https://opengraph.githubassets.com/1/yamada-ui/yamada-ui",
    type: "oss" as const,
  },
];

export const navigation = [
  { href: "#about", label: { en: "About", ja: "概要" } },
  { href: "#experience", label: { en: "Experience", ja: "経歴" } },
  { href: "#skills", label: { en: "Skills", ja: "スキル" } },
  { href: "#works", label: { en: "Works", ja: "制作物" } },
  { href: "#blog", label: { en: "Blog", ja: "ブログ" } },
  { href: "#contact", label: { en: "Contact", ja: "お問い合わせ" } },
];

export const skills = [
  // Frontend
  {
    name: "React.js",
    iconUrl: "https://cdn.simpleicons.org/react/61DAFB",
    color: "#61DAFB",
  },
  {
    name: "Next.js",
    iconUrl: "https://cdn.simpleicons.org/nextdotjs/000000",
    color: "#000000",
  },
  {
    name: "TypeScript",
    iconUrl: "https://cdn.simpleicons.org/typescript/3178C6",
    color: "#3178C6",
  },
  // Mobile
  {
    name: "Flutter",
    iconUrl: "https://cdn.simpleicons.org/flutter/02569B",
    color: "#02569B",
  },
  // Backend - Node.js Stack
  {
    name: "Node.js",
    iconUrl: "https://cdn.simpleicons.org/nodedotjs/339933",
    color: "#339933",
  },
  {
    name: "Express.js",
    iconUrl: "https://cdn.simpleicons.org/express/000000",
    color: "#000000",
  },
  // Backend - Java Stack
  {
    name: "Java",
    iconUrl: "https://cdn.simpleicons.org/openjdk/437291",
    color: "#437291",
  },
  {
    name: "Spring Boot",
    iconUrl: "https://cdn.simpleicons.org/springboot/6DB33F",
    color: "#6DB33F",
  },
  // Database & Cloud
  {
    name: "PostgreSQL",
    iconUrl: "https://cdn.simpleicons.org/postgresql/4169E1",
    color: "#4169E1",
  },
  {
    name: "Firebase",
    iconUrl: "https://cdn.simpleicons.org/firebase/FFCA28",
    color: "#FFCA28",
  },
  // DevOps & Monitoring
  {
    name: "Docker",
    iconUrl: "https://cdn.simpleicons.org/docker/2496ED",
    color: "#2496ED",
  },
  {
    name: "Sentry",
    iconUrl: "https://cdn.simpleicons.org/sentry/362D59",
    color: "#362D59",
  },
  // Other
  {
    name: "Python",
    iconUrl: "https://cdn.simpleicons.org/python/3776AB",
    color: "#3776AB",
  },
];
