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
        link="https://traffictools.com.au"
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
        link="http://centresafe.com/index"
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
        link="https://connect-five-five.vercel.app/"
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
        In its development, Tailwind CSS facilitated the creation of a modern
        design with offset div elements to create the grid. JavaScript and React
        hooks were used to implement the game logic, allowing for dynamic
        interaction and instant updates. With its focus on simplicity and user
        experience, Connect Five showcases my javascript proficiency and
        provides an engaging web app for players of all ages.
      </WorkPanel>
      <WorkPanel
        image="Sliding-tiles.png"
        title="Sliding Tiles Puzzle"
        techStack={["API", "Javascript", "Next.js", "Typescript"]}
        link="https://sliding-puzzle-rho.vercel.app/"
      >
        A retro and nostalgic Sliding Tile Puzzle game which brings back the
        excitement of your childhood. With five grid sizes to choose from, this
        app offers a challenging yet entertaining experience. Whether
        you&apos;re a puzzle enthusiast looking to sharpen your skills or a
        casual gamer seeking a brain-teasing pastime, this app has something for
        everyone. <br />
        <br />
        The Sliding Tile Puzzle uses the Unsplash developer API to fetch random
        images for the puzzle. The image is then scaled based on its aspect
        ratio which allows it to fit into the puzzle pieces no matter the image
        or puzzle resolution.
        <br />
        <br />
        Creating the puzzle board introduced some interesting javascript logic,
        as only one half of randomly generated puzzles are solvable. The
        solution for a randomised yet solvable puzzle comes from calculating the
        parity of the generated array, and swapping any two random pieces as
        required. More information regarding the solvability of sliding tile
        puzzles is referenced{" "}
        <a href="https://www.cs.princeton.edu/courses/archive/spring21/cos226/assignments/8puzzle/specification.php#:~:text=Thus%2C%20if%20a%20board%20has,inversions%2C%20then%20it%20is%20solvable.">
          here
        </a>
        .
      </WorkPanel>
    </div>
  );
}
