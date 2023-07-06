"use client";

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
        techStack={[
          "Next.js",
          "TypeScript",
          "HTML",
          "CSS",
          "Chakra-UI",
          "Vercel",
        ]}
        link="https://traffictools.com.au"
        github="https://github.com/caltho/traffic-tools"
      >
        Traffic Tools is an open-source and free web app created for use by
        anyone within the town-planning industry. In developing the web app I
        aimed to create a tool that would be useful for professionals and
        laypeople, while encouraging innovation and knowledge-sharing within the
        profession.
        <br />
        <br />I built Traffic Tools using Next.js with TypeScript,
        Google-firebase for user authentication, Chakra-UI for the component
        library, and the chart.js plugin for creating charts.
        <br />
        <br />I enjoyed making each component as modular as possible, not only
        to eliminate repitition of code but also to use the calculators in
        future projects within the Traffic Engineering space.
      </WorkPanel>
      <WorkPanel
        image="CTS Favicon - Original.svg"
        title="CentreSafe"
        techStack={["PHP", "MySQL", "AWS-S3", "Bootstrap", "UX/UI"]}
        link="http://centresafe.com/index"
        github="https://github.com/caltho/centresafe"
      >
        CentreSafe is a risk management service created for use by companies and
        NGOs. The CentreSafe portal allows users to quickly understand where the
        critical risks lie within their organisation, and to forecast upcoming
        risks. Risk management data within Centresafe is immutable allowing
        organisations to clearly see the risk treatment lifecycle from
        identification to mitigation and elimination.
        <br />
        <br />I built CentreSafe using the LAMP software stack, which includes
        PHP, MySQL and hosting via AWS. I challenged myself by building the app
        without a component library, while using Bootstrap to fasttrack the CSS
        and provide a consistent feel.
      </WorkPanel>
      <WorkPanel
        image="CentreSafe Web Design.png"
        title="CentreSafe Web Design"
        techStack={[
          "Figma",
          "Photoshop",
          "Font End Design",
          "UX/UI",
          "Branding",
        ]}
        link="https://drive.google.com/file/d/17FdxlspCdb8Zt73JDnf2E8jeFu0sSHqy/view?usp=drive_link"
        github=""
      >
        I created brand guidelines and a web design template for CentreSafe. My
        primary goal was to establish a strong and consistent visual identity
        that would effectively convey CentreSafe&apos;s mission, values, and
        services. This document outlined the appropriate usage of
        CentreSafe&apos;s logo, defined a color palette that evoked feelings of
        trust, and security, and established a typography system that balanced
        professionalism with approachability.
      </WorkPanel>
      <WorkPanel
        image="Connect-five-1.png"
        title="Connect-five"
        techStack={["Next.js", "TypeScript", "Vercel"]}
        link="https://connect-five-five.vercel.app/"
        github="https://github.com/caltho/connect-five"
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
        techStack={["API", "Javascript", "Next.js", "TypeScript"]}
        link="https://sliding-puzzle-rho.vercel.app/"
        github="https://github.com/caltho/sliding-puzzle"
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
      <WorkPanel
        image="Callum David Thomas.png"
        title="Portfolio"
        techStack={["Figma", "Javascript", "Next.js", "TailwindCSS"]}
        link="https://www.figma.com/proto/nsNsYOoaPZpzXxinP1ccsc/Cal-Portfolio?page-id=0%3A1&type=design&node-id=1-2&viewport=561%2C293%2C0.39&scaling=scale-down&starting-point-node-id=1%3A2"
        github="https://github.com/caltho/callumdavidthomas"
      >
        This is my portfolio! I built it from a figma design by Oliver Wedd
        using tailwindcss and have hosted it on Vercel!
      </WorkPanel>
      <WorkPanel
        image="NZOPA logo.png"
        title="NZOPA Revamp"
        techStack={["Wordpress", "PHP", "MySQL", "Design"]}
        link="https://nzopa.co.nz/"
        github=""
      >
        The New Zealand Orthotics & Prosthetics Association (NZOPA) commissioned
        me to revamp their website and member portal. NZOPA required that the
        site&apos;s would end up entirely in their hands which was a key
        consideration when choosing the CMS, which would ultimately need to be
        customisabile yet simple and maintainable. I set up a new Wordpress site
        and utilised plugins to:
        <ul className="list-disc list-inside">
          <li>Allow member sign-ups.</li>
          <li>Show/hide content at different membership levels.</li>
          <li>Accept online payments.</li>
          <li>Allow members to upload case studies requiring a custom form.</li>
          <li>Give admins access to creating new pages and blogposts.</li>
        </ul>
        I spent two sessions with NZOPA committee members to provide guidance
        and training for administering the Wordpress site. Overall the project
        was a success and we recieved positive feedback from members.
      </WorkPanel>
      <WorkPanel
        image="Amber-circle-orange.png"
        title="Amber Organisation WordPress Plugin"
        techStack={["Wordpress", "PHP", "MySQL", "Plugin"]}
        link="https://github.com/caltho/Quote-Sign-Plugin"
        github="https://github.com/caltho/Quote-Sign-Plugin"
      >
        While working at Amber Organisation as a senior traffic engineeer, I
        provided key input to the design and functionality of the company
        website including custom HTML and CSS, implementing a child theme,
        upgrading to the latest version of Wordpress and PHP, optimising images
        for web.
        <br />
        <br />A difficulty I found our clients had was the ease of signing
        quotes. In almost all cases our clients were unable to edit and sign
        PDFs which resulted in them printing off paper copies, signing by hand,
        scanning, and sending via email. I sought to overcome this challenge by
        providing a simple portal where clients could view and sign quotes on
        any electonic device and their details would be collected by us
        electronically. <br />
        <br />I achieved this through custom Wordpress templates, a new MySQL
        table, and custom forms. The quote is uploaded by Amber and displayed
        via an iFrame.
      </WorkPanel>
      <WorkPanel
        image="modal-logo.png"
        title="Modal Group Replatform"
        techStack={[
          "Next.js",
          "Chakra-UI",
          "Wordpress",
          "PHP",
          "MySQL",
          "Replatform",
        ]}
        link="http://modalgroup.com.au/"
        github="https://github.com/caltho/modalgroup"
      >
        Modal Group had an existing Wordpress website and requested that it be
        replatformed using React. I chose the Next.js framework because of its
        speed and the ability to provide static HTML that is great for SEO.
        <br />
        <br />I was able to quickly create elements across the website using the
        Chakra-UI component library, and customise the theme to suit the Modal
        colours. The result is a website that is better than 1:1, providing
        speed, responsiveness, and customisability while not losing out on SEO
        from static HTML/PHP.
      </WorkPanel>
    </div>
  );
}
