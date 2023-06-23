import WorkPanel from "./workPanel";

export default function MyWork() {
  return (
    <div className="w-full">
      <h2 className="mb-2 mt-0 text-4xl font-medium leading-tight text-primary">
        My Work
      </h2>
      <div className="my-6 h-0.5 w-full bg-neutral-100 opacity-100" />
      <WorkPanel
        image="Traffic Tools Logo.png"
        title="Traffic Tools"
        techStack={["Next.js", "Typescript", "HTML", "CSS"]}
      >
        Traffic Tools is an open-source and free web app created for use by
        anyone within the town-planning industry. In developing the web app I
        aimed to create a tool that would be useful for professionals and
        laypeople, while encouraging innovation and knowledge-sharing within the
        profession.
        <br />
        <br />I built Traffic Tools using next.js with typescript,
        Google-firebase for user authentication, Chakra-UI for the component
        library, and the chart.js plugin for creating charts.
      </WorkPanel>
      <WorkPanel
        image="CTS Favicon - Original.svg"
        title="CentreSafe"
        techStack={["PHP", "MySQL", "AWS-S3"]}
      >
        CentreSafe is a risk management service created for use by companies and
        NGOs. The CentreSafe portal allows users to quickly understand where the
        critical risks lie within their organisation, and to forecast upcoming
        risks. Risk management data within Centresafe is immutable allowing
        organisations to clearly see the risk treatment lifecycle from
        identification to mitigation and elimination.
        <br />
        <br />I built CentreSafe using the LAMP software stack, which includes
        PHP, MySQL and hosting via AWS.
      </WorkPanel>
      <WorkPanel
        image="Connect-five-1.png"
        title="Connect-five"
        techStack={["Next.js", "Typescript", "Vercel"]}
      >
        Connect Five is an exciting web game built with Next.js and Tailwind
        CSS. The goal is to strategically connect five game pieces in a row on a
        19x19 grid. Players take turns clicking on the grid to place their black
        or white circles. The game tracks the board state, checks for win
        conditions, and provides an intuitive user interface. With its seamless
        integration of React components and easy styling using Tailwind CSS,
        Connect Five offers a captivating and visually appealing gaming
        experience. <br />
        <br />
        In its development, Next.js was chosen for its server-side rendering
        capabilities, while Tailwind CSS facilitated the creation of a modern
        and polished design. JavaScript and React hooks were used to implement
        the game logic, allowing for dynamic interaction and real-time updates.
        With its focus on simplicity and user experience, Connect Five showcases
        technical proficiency and provides an engaging web app for players of
        all ages.
      </WorkPanel>
    </div>
  );
}
