'use client';

import { faBriefcase, faFilePdf, faFlask, faGlobe, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, SubCard } from '../_components/card';
import { ExternalLink } from '../_components/link';
import { PageContent } from '../_components/pageContent';
import { Sidebar } from '../_components/sidebar';
import resume from '../_data/resume.json';

interface Skill {
  title: string;
  category: string;
  proficiency: number;
}
interface Content {
  title?: string;
  description?: string;
  link?: string;
}
interface EducationContent extends Content {
  degrees: { title: string, description: string }[];
}

export default function Resume() {
  const [ onSkills, setOnSkills ] = useState(false);
  return (
    <>
      <Sidebar />
      <PageContent>
        <div className="flex inline-flex text-4xl font-bold m-4 mt-10 text-gray-400 dark:text-gray-500">
          <div className={onSkills ? 'text-gray-700 dark:text-gray-200 underline' : 'hover:text-gray-500 dark:hover:text-gray-400'} onClick={() => setOnSkills(true)}>
            Skills
          </div>
          <div className='pr-4 pl-4'>|</div>
          <div className={onSkills ? 'hover:text-gray-500 dark:hover:text-gray-400' : 'text-gray-700 dark:text-gray-200 underline'} onClick={() => setOnSkills(false)}>
            Background
          </div>
        </div>
        {onSkills ? <Skills /> : <Background />}
      </PageContent>
    </>
  );
}

function Skills() {
  const [ skillsSelected, setSkillsSelected ] = useState<string>('All');
  const skillsCategories = [ 'All', ...new Set(resume.skills.map(skill => skill.category).sort()) ];

  const colors = [
    '',
    'bg-emerald-300 dark:bg-emerald-600',
    'bg-orange-300 dark:bg-orange-600',
    'bg-blue-300 dark:bg-blue-600',
    'bg-yellow-300 dark:bg-yellow-600',
    'bg-purple-300 dark:bg-purple-600',
    'bg-red-300 dark:bg-red-600',
  ];
  const colorMap = skillsCategories.reduce((map, key, index) => {
    map.set(key, colors[index]);
    return map;
  }, new Map<string, string>());

  return (<Card padding="p-10 pt-8 pb-6 w-9/10">
    <div className='flex inline-flex mb-4'>
      {skillsCategories.map((category, index) => (
        <button
          key={index}
          className={`${skillsSelected === category ? 'bg-gray-600 text-white' : 'bg-gray-300 dark:bg-gray-900 hover:bg-gray-500 dark:hover:bg-gray-700 hover:text-white'} rounded-md px-3 py-2 text-sm font-medium text-black dark:text-white focus:bg-gray-600 focus-text-white mr-1 ml-1`}
          onClick={() => setSkillsSelected(category)}
        >
          {category}
        </button>))}
    </div>
    <SubCard padding="p-5 w-full">
      <div className='flex flex-col w-full items-center font-medium dark:text-gray-200 text-gray-800'>
        Proficiency Level
        {filterSkills(resume.skills, skillsSelected).map((skill, index) => (
          <SkillsSlider key={index} skill={skill} colorMap={colorMap} />))}
      </div>
    </SubCard>
  </Card>);
}

function SkillsSlider({skill, colorMap}: {skill: Skill, colorMap: Map<string, string>}) {
  const proficiencyWidths = [ 'w-0', 'w-1/5', 'w-2/5', 'w-3/5', 'w-4/5', 'w-full' ];
  return (
    <div className='h-10 w-full mt-4 font-semibold dark:text-gray-900 text-gray-800'>
      <div className={'rounded-md w-full bg-gray-500/50 dark:bg-gray-900/50 h-full p-1'}>
        <div className={`${proficiencyWidths[skill.proficiency]} rounded-sm ${colorMap.get(skill.category)} h-full pt-1 pl-4 inline-flex`}>
          {skill.title.replace(/ /g, '\u00A0')/*Replace space with non-breaking space to prevent line breaks*/}
          <div className='w-full text-right text-xs pr-2 pt-2'>
            {skill.proficiency}/5
          </div>
        </div>
      </div>
    </div>);
}

function filterSkills(skills: Skill[], selected: string) {
  function skillsComparator(a: Skill, b: Skill) {
    if (a.proficiency === b.proficiency) {
      if (a.category === b.category) {
        return a.title.localeCompare(b.title);
      }
      return a.category.localeCompare(b.category);
    }
    return b.proficiency - a.proficiency;
  }

  if (selected === 'All') {
    return skills.sort(skillsComparator);
  }
  return skills.filter(skill => skill.category === selected).sort(skillsComparator);
}

function Background() {
  return (
    <>
      <EducationCard
        title="Education"
        content={resume.education}
        icon={<FontAwesomeIcon icon={faUserGraduate} />} />
      <ResumeCard
        title="Work Experience"
        content={resume.work}
        icon={<FontAwesomeIcon icon={faBriefcase} />} />
      <ResumeCard
        title="Research"
        content={resume.research}
        icon={<FontAwesomeIcon icon={faFlask} />} />
      <ResumeCard
        title="Languages"
        content={resume.languages}
        icon={<FontAwesomeIcon icon={faGlobe} />} />
      <ResumeFileCard />
    </>
  );
}

function ResumeCard({title, content, icon}: {title: string, content: Content[], icon: React.ReactNode}) {
  return (
    <div className='w-full flex inline-flex text-gray-800 dark:text-gray-200 justify-center'>
      <SideIcon>
        {icon}
      </SideIcon>
      <Card padding="p-10 pt-8 pb-6 w-full" centering={false}>
        <h2 className='text-xl font-bold pb-4'>{title}</h2>
        {content.map((item, index) => (
          <div key={index} className='flex flex-col ml-2 w-full'>
            <ExternalLink href={item.link} className={`text-lg font-semibold ${item.link && 'hover:text-blue-600 dark:hover:text-blue-400'}`}>{item.title}</ExternalLink>
            <div className='prose !max-w-none leading-none text-gray-800 dark:text-gray-200'>
              <ReactMarkdown>
                {item.description}
              </ReactMarkdown>
            </div>
          </div>))}
      </Card>
    </div>

  );
}

function EducationCard({content, icon}: {title: string, content: EducationContent[], icon: React.ReactNode}) {
  return (
    <div className='w-full flex inline-flex text-gray-800 dark:text-gray-200 justify-center'>
      <SideIcon>
        {icon}
      </SideIcon>
      <Card padding="p-10 pt-8 pb-6 w-full" centering={false}>
        <h2 className='text-xl font-bold pb-4'>Education</h2>
        {content.map((item, index) => (
          <div key={index} className='flex flex-col ml-2 w-full'>
            <ExternalLink href={item.link} className={`text-lg font-semibold ${item.link && 'hover:text-blue-600 dark:hover:text-blue-400'}`}>{item.title}</ExternalLink>
            <div className='!max-w-none leading-none text-md text-gray-800 dark:text-gray-200 pl-2'>
              {item.degrees.map((degree, degreeIndex) => (
                <div key={degreeIndex} className='pt-3 font-medium'>
                  {degree.title}
                  <div className='text-sm pl-2 font-normal'>
                    {degree.description}
                  </div>
                </div>))}
            </div>
            <div className='prose !max-w-none font-medium text-gray-800 dark:text-gray-200'>
              <ReactMarkdown>
                {item.description}
              </ReactMarkdown>
            </div>
          </div>))}
      </Card>
    </div>

  );
}

function ResumeFileCard(){
  return (
    <div className='w-full flex inline-flex text-gray-800 dark:text-gray-400 justify-center'>
      <SideIcon>
        <FontAwesomeIcon icon={faFilePdf} />
      </SideIcon>
      <Card padding="p-10 pt-8 pb-6 w-full" centering={false}>
        <a href="/static/Vivek_Yanamadula_Resume.pdf" download className='text-blue-700 dark:text-blue-400 hover:underline'>
          Download Full Resume
        </a>
      </Card>
    </div>
  );
}

function SideIcon({children}: {children: React.ReactNode}) {
  return (
    <div className='pt-12 pl-8 pr-4 text-3xl text-gray-900 dark:text-gray-100'>
      {children}
    </div>
  );
}