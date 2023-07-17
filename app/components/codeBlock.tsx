import { Prism } from "@mantine/prism";
import { useState } from "react";

interface codeType {
  [key: string]: string;
}
const code = {
  folderFinder: `'FOLDER FINDER SCRIPT
  Dim jobNumber
  Dim tempString
  Dim validInput
  Dim fileLocation
  fileLocation = "REPLACE THIS WITH THE ROOT FILE LOCATION EG: c:\company\Projects\"
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
'C:\Windows\System32\wscript.exe"[FULL PATH TO folderfinder.vbs]"
'Click next
'The new shortcut can be dragged onto the taskbar
'The keyboard shortcut for the taskbar is WINDOWS+[Task bar item]`,
  jumpToFolder: `Option Explicit

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
  fileMail: `Option Explicit

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
    a = Split(fname, "\")
    GetRightFolder = a(UBound(a))
End Function

`,
};
interface CodeBlockType {
  name: keyof typeof code;
}

export default function CodeBlock({ name }: CodeBlockType) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    setShownCode(!expanded ? code[name] : trimToThreeLines(code[name]));
  };

  const trimToThreeLines = (text: string) => {
    const lines = text.split("\n");
    const trimmedLines = lines.slice(0, 3);
    const trimmedText = trimmedLines.join("\n");
    return trimmedText;
  };

  const [shownCode, setShownCode] = useState(trimToThreeLines(code[name]));

  return (
    <div>
      <Prism
        language="jsx"
        copyLabel="Copy code"
        copiedLabel="Code copied!"
        colorScheme="dark"
      >
        {shownCode}
      </Prism>
      <button
        onClick={toggleExpanded}
        className="rounded-bl-lg rounded-br-lg bg-blue-500 p-2"
      >
        {expanded ? "Shrink Code" : "Expand Code"}
      </button>
    </div>
  );
}
