import type { Project } from "../types/project";

export const projects: Project[] = [
  {
    slug: "quality-management-system",
    title: "Quality Management System",
    summary: `A web-based Quality & Safety Management tool for construction sites.`,
    tags: ["Angular", "Node.js", "MySQL", "TypeScript", "Material-UI"],
    number: 101,
    thumbnail: "RJE_Logo_Byline.png",
    image: [
      "rje/QMS (1).png",
      "rje/QMS (2).png",
      "rje/QMS (3).png",
      "rje/QMS (4).png",
      "rje/QMS (5).png",
      "rje/QMS (6).png",
      "rje/QMS (7).png",
    ],
    techStack: ["Angular", "Node.js", "MySQL", "TypeScript", "Material-UI"],
    link: "",
    github: "",
    longDescription: `
        A key project during my role at RJE Global was a web-based Quality &
        Safety Management tool designed for use on active construction sites.
        The application enables site staff to digitally capture safety and
        quality data during construction, replacing paper-based processes.
        <br />
        <br />
        As the Lead Software Developer and Product Owner, I took full ownership
        of the legacy Quality & Safety management web application and led a
        major front-end and back-end overhaul, migrating the codebase from
        JavaScript to TypeScript, restructuring the application for modularity
        and scalability, and greatly improving page load speed and
        user-experience.`,
  },

  {
    slug: "traffic-tools",
    thumbnail: "traffictools/Traffic Tools Logo.png",
    image: [
      "traffictools/TT - Parking Rates.png",
      "traffictools/TT - Ramp Design.png",
      "traffictools/TT - Turn Treatment Calculator.png",
      "traffictools/TT - Trip Generation Calculator.png",
    ],
    summary:
      "A collection of calculators and tools designed for traffic engineers and urban planners.",
    title: "Traffic Tools",
    tags: ["Next.js", "TypeScript", "HTML", "CSS", "Chakra-UI", "Vercel"],
    techStack: ["Next.js", "TypeScript", "HTML", "CSS", "Chakra-UI", "Vercel"],
    number: 0,
    link: "https://www.traffictools.com.au",
    github: "https://github.com/caltho/traffic-tools",
    longDescription: `
      Traffic Tools is an open-source and free web app created for use by
      anyone within the town-planning industry. In developing the web app I
      aimed to create a tool that would be useful for professionals and
      laypeople, while encouraging innovation and knowledge-sharing within the
      profession.
      <br />
      <br />
      I built Traffic Tools using Next.js with TypeScript, Google Firebase for
      user authentication, Chakra UI for the component library, and Chart.js
      for charts.
      <br />
      <br />
      I made each component as modular as possible — not only to eliminate
      repetition of code, but also to reuse the calculators in future projects
      within the traffic-engineering space.
  `,
  },
  {
    slug: "centresafe",
    thumbnail: "centresafe/CTS Logo - Negative.svg",
    image: ["centresafe/CTS Logo - Negative.svg"],
    title: "CentreSafe",
    summary: "A risk management portal for companies and NGOs.",
    tags: ["PHP", "MySQL", "AWS-S3", "Bootstrap", "UX/UI"],
    number: 1,
    techStack: ["PHP", "MySQL", "AWS-S3", "Bootstrap", "UX/UI"],
    link: "",
    github: "https://github.com/caltho/centresafe",
    longDescription: `CentreSafe is a risk management service for companies and NGOs. The portal allows users to quickly understand where the critical risks lie within their organisation and to forecast upcoming risks. Risk management data within CentreSafe is immutable, allowing organisations to clearly see the risk treatment lifecycle from identification through mitigation to elimination.
<br /><br />
I built CentreSafe on the LAMP stack — PHP and MySQL, hosted on AWS. I challenged myself by building the app without a component library, using Bootstrap to fast-track the CSS and provide a consistent feel.`,
  },
  {
    slug: "centresafe-web-design",
    title: "CentreSafe Web Design",
    summary: "Brand guidelines and web design template for CentreSafe.",
    tags: ["Figma", "Photoshop", "Front End Design", "UX/UI", "Branding"],
    number: 2,
    thumbnail: "centresafe/CentreSafe Web Design.png",
    image: [
      "centresafe/CS - Centres.png",
      "centresafe/CS - Examples.png",
      "centresafe/CS - Orgs.png",
      "centresafe/CS - Form.png",
    ],
    techStack: ["Figma", "Photoshop", "Front End Design", "UX/UI", "Branding"],
    link: "https://drive.google.com/file/d/17FdxlspCdb8Zt73JDnf2E8jeFu0sSHqy/view?usp=drive_link",
    github: "",
    longDescription: `I created brand guidelines and a web design template for CentreSafe. My primary goal was to establish a strong and consistent visual identity that would effectively convey CentreSafe's mission, values, and services. The document outlines the appropriate usage of CentreSafe's logo, defines a colour palette that evokes trust and security, and establishes a typography system that balances professionalism with approachability.`,
  },
  {
    slug: "connect-five",
    title: "Connect Five",
    summary: "A web game built with Next.js and Tailwind CSS.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    number: 5,
    thumbnail: "connect-five-1.png",
    image: ["connect-five-1.png", "connect-five-2.png", "connect-five-3.png"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    link: "https://connect-five-five.vercel.app",
    github: "https://github.com/caltho/connect-five",
    longDescription: `Connect Five is a web game built with Next.js and Tailwind CSS. The goal is to strategically connect five game pieces in a row on a 19×19 grid. Players take turns clicking the grid to place their black or white circles; the game tracks the board state, checks for win conditions, and provides an intuitive interface.
<br /><br />
Tailwind CSS handled the visual side — offset div elements to render the grid, modern type, generous spacing. JavaScript and React hooks implemented the game logic, allowing for dynamic interaction and instant updates. With its focus on simplicity and clean UX, Connect Five is a small showcase of my TypeScript work and an engaging web app for players of all ages.`,
  },
  {
    slug: "sliding-tiles-puzzle",
    title: "Sliding Tiles Puzzle",
    summary: "Retro sliding tile puzzle game with multiple grid sizes.",
    tags: ["API", "Next.js", "TypeScript"],
    number: 4,
    thumbnail: "sliding-tiles/sliding-tiles-1.png",
    image: [
      "sliding-tiles/sliding-tiles-1.png",
      "sliding-tiles/sliding-tiles-2.png",
      "sliding-tiles/sliding-tiles-3.png",
    ],
    techStack: ["API", "Next.js", "TypeScript"],
    link: "https://sliding-puzzle-rho.vercel.app",
    github: "https://github.com/caltho/sliding-puzzle",
    longDescription: `A retro and nostalgic sliding-tile puzzle that brings back the excitement of your childhood. With five grid sizes to choose from, the app offers a challenging yet entertaining experience. It uses the Unsplash developer API to fetch random images for the puzzle, then scales each image based on its aspect ratio so it fits the puzzle pieces regardless of source resolution.
    <br />
    <br />
Building the puzzle board introduced some interesting game logic — only half of all randomly generated puzzles are actually solvable. The trick to a randomised-yet-solvable puzzle is calculating the parity of the generated array and swapping any two pieces if it comes out unsolvable. More on the solvability of sliding-tile puzzles is referenced <a href="https://www.cs.princeton.edu/courses/archive/spring21/cos226/assignments/8puzzle/specification.php">here</a>.`,
  },
  {
    slug: "portfolio",
    title: "Portfolio (this site)",
    summary:
      "This site. Fully AI-built editorial-brutalist portfolio with a custom admin, live data, and a /b-sides shelf for internet relics.",
    tags: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "Motion",
      "Supabase",
      "Vercel",
    ],
    number: 5,
    thumbnail: "Callum David Thomas.png",
    image: ["Callum David Thomas.png"],
    techStack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "Motion",
      "Supabase",
      "Vercel",
    ],
    link: "https://callumdavidthomas.com",
    github: "https://github.com/caltho/callumdavidthomas",
    longDescription: `This is the site you're looking at. Editorial brutalism meets basement-club: massive Fraunces display type, drifting CSS club lights, oxide-red accents, film-grain overlay. No scroll hijacking — native scroll only.
    <br /><br />
    Stack: Next.js 16 on the App Router with React 19 Server Components, Tailwind v4 (CSS-first design tokens), Motion for the reveal animations, and a small set of hand-rolled UI primitives I fully own. Content lives in Supabase Postgres, colocated in another of my projects with all tables prefixed and gated by Row-Level Security. There's a /admin panel behind Supabase Auth so I can add projects, stuff, and update the about page without touching code — image uploads go straight to a public Storage bucket.
    <br /><br />
    It was built end-to-end in collaboration with Claude — paired with the AI on architecture, scaffolding, design tokens, schema, and copy. A working example of what "AI-built" can actually look like when you treat the model as a senior collaborator instead of a fancy autocomplete.`,
  },
  {
    slug: "nzopa-revamp",
    title: "NZOPA Revamp",
    summary: "Revamp of NZOPA website and member portal.",
    tags: ["WordPress", "PHP", "MySQL", "Design"],
    number: 6,
    thumbnail: "NZOPA logo.png",
    image: [],
    techStack: ["WordPress", "PHP", "MySQL", "Design"],
    link: "https://nzopa.co.nz/",
    github: "",
    longDescription: `The New Zealand Orthotics & Prosthetics Association (NZOPA) commissioned me to revamp their website and member portal. I set up a new WordPress site and configured plugins to:
<ul>
<li>Allow member sign-ups.</li>
<li>Show/hide content at different membership levels.</li>
<li>Accept online payments.</li>
<li>Let members upload case studies via a custom form.</li>
<li>Give admins access to creating new pages and blog posts.</li>
</ul>
I spent two sessions with the NZOPA committee providing guidance and training on administering the site. The project was a success and we received positive feedback from members.`,
  },
  {
    slug: "amber-wordpress-plugin",
    title: "Amber Organisation WordPress Plugin",
    summary: "Custom plugin to streamline quote signing process.",
    tags: ["WordPress", "PHP", "MySQL", "Plugin"],
    number: 7,
    thumbnail: "Amber-circle-orange.png",
    image: [],
    techStack: ["WordPress", "PHP", "MySQL", "Plugin"],
    link: "",
    github: "https://github.com/caltho/Quote-Sign-Plugin",
    longDescription: `While working at Amber Organisation as a senior traffic engineer, I provided key input on the design and functionality of the company website — custom HTML and CSS, a child theme, upgrades to the latest version of WordPress and PHP, and image optimisation for the web.
<br /><br />
A pain point our clients consistently raised was the cumbersome process of signing quotes. I built a simple portal where clients could view and sign quotes on any electronic device, implemented via custom WordPress templates, a new MySQL table, and custom forms.`,
  },
  {
    slug: "modal-group-replatform",
    title: "Modal Group Replatform",
    summary: "Replatformed Modal Group site from WordPress to React.",
    tags: ["Next.js", "Chakra-UI", "WordPress", "PHP", "MySQL", "Replatform"],
    number: 8,
    thumbnail: "modal-logo.png",
    image: [],
    techStack: [
      "Next.js",
      "Chakra-UI",
      "WordPress",
      "PHP",
      "MySQL",
      "Replatform",
    ],
    link: "https://modalgroup.com.au/",
    github: "https://github.com/caltho/modalgroup",
    longDescription: `Modal Group had an existing WordPress site and asked me to replatform it on React. I chose Next.js for speed and static HTML for SEO. I built out the UI with Chakra UI, customising the theme to match Modal's brand colours — the result is faster, more responsive, and easier to extend.`,
  },
  {
    slug: "project-folder-shortcut",
    title: "Project Folder Shortcut",
    summary: "Visual Basic Script tool to quickly open folders.",
    tags: ["Visual Basic Script", "Windows OS", "Productivity"],
    number: 9,
    thumbnail: "vbs.png",
    image: [],
    techStack: ["Visual Basic Script", "Windows OS", "Productivity"],
    link: "",
    github: "",
    longDescription: `File structures within large organisations can often be cumbersome. This FolderFinder shortcut opens a folder based on a 3-letter search string entered by the user.`,
    codeblock: {
      lang: "clike",
      desc: [`VB Code`],
      code: [
        `'FOLDER FINDER SCRIPT
  Dim jobNumber
  Dim tempString
  Dim validInput
  Dim fileLocation
  fileLocation = "REPLACE THIS WITH THE ROOT FILE LOCATION EG: c:companyProjects"
  validInput = 0
  
  Do While validInput = 0
  validInput = 1
  'Get user input and validate
  jobNumber = InputBox("Enter Job Number:")
  
  'Quit if Cancel or Escape
  If IsEmpty(jobNumber) Then
      Wscript.Quit
  Else 
      jobNumber = LCase(jobNumber)
  End If
  
  If Len(jobNumber) <> 3 Then
  MsgBox "Wrong String Length"
  validInput = 0
  End If
  
  Loop
  '*****while next
  
  'Create Explorer Object
  
  'MsgBox "fileLocation:" & fileLocation
  Set WshShell = WScript.CreateObject("WScript.Shell")
  
  'Find Subfolder and Open
  Set objFSO = CreateObject("Scripting.FileSystemObject")
  Set objFolder = objFSO.GetFolder(fileLocation)
  For Each objFile in objFolder.SubFolders
     'Search for the folder extension using +1 because the extension starts with /
     If LCase(Mid(objFile.Path, Len(fileLocation)+1, 3)) = jobNumber Then
      'MsgBox Mid(objFile.Path, Len(fileLocation)+1, 3)
      'MsgBox "You entered:" & jobNumber
      'MsgBox objFile.Path
      WshShell.Run "Explorer /n," & Chr(34) & objFile.Path & Chr(34), 1, False
      Wscript.Quit
  Exit For
     End If
  Next 
  MsgBox "Job Folder Does Not Exist!"
  WshShell.Run "Explorer /n," & fileLocation, 1, False
  
'README
'Copy the code into a new notepad file and save-as folderfinder.vbs 
'Right-click your desktop -> New -> Shortcut
'In the location field type: (including the quotes) 
'C:WindowsSystem32wscript.exe"[FULL PATH TO folderfinder.vbs]"
'Click next
'The new shortcut can be dragged onto the taskbar
'The keyboard shortcut for the taskbar is WINDOWS+[Task bar item]`,
      ],
    },
  },
  {
    slug: "outlook-filing-macro",
    title: "Outlook Filing Macro",
    summary: "Custom VBA macros to streamline Outlook email filing.",
    tags: [
      "Visual Basic for Applications",
      "Macros",
      "Windows OS",
      "Productivity",
    ],
    number: 10,
    thumbnail: "outlook.png",
    image: [],
    techStack: [
      "Visual Basic for Applications",
      "Macros",
      "Windows OS",
      "Productivity",
    ],
    link: "",
    github: "",
    longDescription: `Productivity is about saving time and reducing mental overhead. These Outlook macros allow quick filing of emails via keyboard shortcuts without losing screen focus. Includes macros: jumpToFolder, fileMail.`,
    codeblock: {
      lang: "clike",
      desc: [
        `Macro 1 will jump directly to the folder based on your search input. `,
        `Macro 2 will file the selected mail item(s) directly into the searched folder, without changing the screen focus. `,
      ],
      code: [
        `Option Explicit

Private m_Folder As MAPIFolder
Private m_Find As String
Private m_Wildcard As Boolean

Private Const SpeedUp As Boolean = True
Private Const StopAtFirstMatch As Boolean = True



Public Sub GotoFolder()
Dim sName As String
Dim oFolders As Folders

  Set m_Folder = Nothing
m_Find = ""
m_Wildcard = False

sName = InputBox("Find:", "Search folder")
If Len(Trim(sName)) = 0 Then Exit Sub

m_Find = sName & "*"

BroadenSearch:

  m_Find = LCase(m_Find)
m_Find = Replace(m_Find, "%", "*")
m_Wildcard = (InStr(m_Find, "*"))

  Set oFolders = Application.Session.Folders
LoopFolders oFolders

If Not m_Folder Is Nothing Then
    If MsgBox("This Folder: " & vbCrLf & GetRightFolder(m_Folder.FolderPath), vbQuestion Or vbYesNo) = vbYes Then
        Set Application.ActiveExplorer.CurrentFolder = m_Folder
    Else
        If MsgBox("Broaden search?", vbQuestion Or vbYesNo) = vbYes Then
            m_Find = "*" & sName & "*"
            GoTo BroadenSearch
        Else
            Exit Sub
        End If
    End If
Else
    If MsgBox("Folder not found. Broaden search?", vbQuestion Or vbYesNo) = vbYes Then
            m_Find = "*" & sName & "*"
            GoTo BroadenSearch
        Else
        MsgBox "Folder not found!!"
            Exit Sub
    End If
End If

End Sub


Private Sub LoopFolders(Folders As Outlook.Folders)
Dim oFolder As MAPIFolder
Dim bFound As Boolean

If SpeedUp = False Then DoEvents

  For Each oFolder In Folders
If m_Wildcard Then
bFound = (LCase(oFolder.Name) Like m_Find)
Else
bFound = (LCase(oFolder.Name) = m_Find)
End If

    If bFound Then
If StopAtFirstMatch = False Then
If MsgBox("Found: " & vbCrLf & oFolder.FolderPath & vbCrLf & vbCrLf & "Continue?", vbQuestion Or vbYesNo) = vbYes Then
bFound = False
End If
End If
End If
If bFound Then
Set m_Folder = oFolder
Exit For
Else
LoopFolders oFolder.Folders
If Not m_Folder Is Nothing Then Exit For
End If
Next

End Sub`,
        `Option Explicit

Private m_Folder As MAPIFolder
Private m_Find As String
Private m_Wildcard As Boolean

Private Const SpeedUp As Boolean = True
Private Const StopAtFirstMatch As Boolean = True



Public Sub FindFolder()
Dim sName As String
Dim oFolders As Folders

  Set m_Folder = Nothing
m_Find = ""
m_Wildcard = False

sName = InputBox("Find:", "Search folder")
If Len(Trim(sName)) = 0 Then Exit Sub

m_Find = sName & "*"

BroadenSearch:

  m_Find = LCase(m_Find)
m_Find = Replace(m_Find, "%", "*")
m_Wildcard = (InStr(m_Find, "*"))

  Set oFolders = Application.Session.Folders
LoopFolders oFolders

If Not m_Folder Is Nothing Then
    If MsgBox("This Folder: " & vbCrLf & GetRightFolder(m_Folder.FolderPath), vbQuestion Or vbYesNo) = vbYes Then
        'Set Application.ActiveExplorer.CurrentFolder = m_Folder
    Else
        If MsgBox("Move cancelled. Broaden search?", vbQuestion Or vbYesNo) = vbYes Then
            m_Find = "*" & sName & "*"
            GoTo BroadenSearch
        Else
            Exit Sub
        End If
    End If
Else
    If MsgBox("Folder not found. Broaden search?", vbQuestion Or vbYesNo) = vbYes Then
            m_Find = "*" & sName & "*"
            GoTo BroadenSearch
        Else
            MsgBox "Folder not found!!"
            Exit Sub
    End If
End If


'This section moves the selected item to the folder
Dim oNamespace As Outlook.NameSpace, oSelection As Outlook.Selection
  Dim oFolder As Outlook.MAPIFolder
  Dim oItem As Object, i As Integer

  Set oNamespace = Application.GetNamespace("MAPI")

  Set oSelection = oNamespace.Application.ActiveExplorer.Selection
  If oSelection.Count < 1 Then Exit Sub

  'Set oFolder = FindFolder
  'If oFolder Is Nothing Then Exit Sub

  ' move items
  For i = 1 To oSelection.Count
    Set oItem = oSelection.Item(i)
    If Not oItem.Parent = m_Folder Then
      oSelection.Item(i).Move m_Folder
    End If
  Next i




End Sub




Private Sub LoopFolders(Folders As Outlook.Folders)
Dim oFolder As MAPIFolder
Dim bFound As Boolean

If SpeedUp = False Then DoEvents

  For Each oFolder In Folders
If m_Wildcard Then
bFound = (LCase(oFolder.Name) Like m_Find)
Else
bFound = (LCase(oFolder.Name) = m_Find)
End If

    If bFound Then
If StopAtFirstMatch = False Then
If MsgBox("Found: " & vbCrLf & oFolder.FolderPath & vbCrLf & vbCrLf & "Continue?", vbQuestion Or vbYesNo) = vbYes Then
bFound = False
End If
End If
End If
If bFound Then
Set m_Folder = oFolder
Exit For
Else
LoopFolders oFolder.Folders
If Not m_Folder Is Nothing Then Exit For
End If
Next

End Sub

Function GetRightFolder(fname) As String
    Dim a
    a = Split(fname, "")
    GetRightFolder = a(UBound(a))
End Function`,
      ],
    },
  },
];
