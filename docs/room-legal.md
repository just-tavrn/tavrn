# Privacy notice and legal notice of a room

A guide for people who run rooms on a tavrn node, and for node operators who want to explain it to them. It covers
when a room may need its own privacy notice or legal notice, what to write, how tavrn shows them, and what the node
operator is responsible for.

> **This is not legal advice.** It summarises the European and German rules most often cited for online communities,
> as of October 2026, with sources. Your situation may differ (country, size, purpose, who your members are). If you
> run a room for a business, an association or a large public community, have the text checked by someone qualified.

## In short

- **Purely private rooms** (friends, family, a closed group of people you know) usually need nothing. The GDPR does
  not apply to "purely personal or household" activity (Art. 2(2)(c) GDPR, recital 18).
- **Rooms that are not purely private** may need a **privacy notice**: public rooms anyone can join, rooms with an
  open invite link, and the community of a business, a club, an association or a creator. Whoever runs such a room
  decides why and how it is used, so they can be a controller for it, jointly with the platform (here: the node
  operator), as the EU Court of Justice found for Facebook fan pages (C-210/16, below).
- **Rooms run business-like** (for a company, a shop, a paid offer, regularly to promote something) may need a
  **legal notice** (in Germany "Impressum", § 5 DDG). Journalistic-editorial rooms in Germany also need a responsible
  person (§ 18(2) MStV).
- The **node operator** stays responsible for the node itself and publishes its own privacy policy. It does not
  replace the room's notice, and the room's notice does not replace it.

## What tavrn offers

Room settings → **Privacy & legal** (for members with *Manage room*):

- two optional Markdown documents, **Privacy notice** (up to 20,000 characters) and **Legal notice** (up to 5,000);
  an empty document is off;
- **Load a template**: a short draft in English or German with placeholders in `[[…]]`, which already describes what
  tavrn processes in a room and links the node's own privacy policy; complete every placeholder and remove the draft
  line before you save;
- **Preview**, the same rendering members see.

When a document is set, tavrn shows it:

- **before joining**: in the join dialog of the invite page, of a pasted invite link, of the invite list (personal
  invitations) and of public rooms on the home view and on Discover, as a link next to the rules;
- **to members**: in the room menu ("Privacy notice", "Legal notice") and in Room settings → Privacy & legal, with
  the date of the last change;
- **across nodes**: members and visitors from other nodes read the documents of the node that hosts the room.

The documents **inform**; nobody has to accept them, and a changed document does not ask members to accept it again.
The law asks for the information to be given (easily accessible, at the time data is collected), not for consent.
Room **rules** are different: they keep their "I accept the rules" checkbox. Every change of the documents is in the
room's audit log (`room.legal`).

## What a privacy notice should say

Art. 13 GDPR lists what people must be told when their data is collected. For a room, in plain language:

1. **Who is responsible** for the room, with contact details (and a data protection officer, if you have one).
2. **What the room processes and why**: membership (address, display name, join date, roles, room nickname and
   avatar), messages, reactions and files in the room's channels, presence in its voice channels. Say what the room
   is for and the **legal basis** (often Art. 6(1)(f) GDPR, a legitimate interest, which you then name).
3. **Who receives the data**: the room's members as far as its channels allow, its moderators, the node operator, and
   bots or applications installed in the room.
4. **How long** data is kept: for example the room's message retention setting, or as long as the room exists.
5. **The rights** of the people concerned (access, rectification, erasure, restriction, portability, objection,
   Art. 15–21 GDPR), how to use them, and the right to complain to a data protection supervisory authority.
6. **Transfers outside the EU** and automated decisions, if any.
7. **The node operator's role**: what the operator does (hosting, the node's own processing), a link to its privacy
   policy, and, if you have an arrangement with the operator, its essence (Art. 26(2) GDPR).

End-to-end encrypted channels are stored by the node only as ciphertext; you may say so. Keep the notice short and
clear (Art. 12 GDPR); the template is a starting point, not a finished text.

## What a legal notice should say

For a German business-like room (§ 5 DDG): name and postal address (for a company the legal form and the
representatives), a fast way to reach you electronically including an e-mail address, and where they apply the
commercial register and number, the VAT identification number and the supervisory authority. German courts have
held that a commercially used social media page needs its own provider identification, reachable with few clicks
(LG Aschaffenburg 2011, OLG Düsseldorf 2013, below); the room's legal notice is that place. Other countries have
their own rules.

## The node operator

The operator runs the node and is a separate controller for what the node does (accounts, storage, logs, delivery,
federation). That is covered by the node's own documents (Admin → Legal on the node; the protocol's
[LEGAL.md](https://github.com/just-tavrn/tavrn-protocol/blob/main/LEGAL.md)). The joint responsibility of a room's
managers and the operator reaches only as far as the processing both actually decide on (CJEU C-40/17 Fashion ID),
and it is not necessarily equal (C-210/16). Operators may want to say in their terms who is responsible for what in
rooms and how requests about a room reach its managers. The node's cookies and storage on the device are the
operator's matter, not the room's (a German court held the same for a platform's cookies on a fan page: VG Köln,
22 July 2025, 13 K 1419/23, appeal allowed, not final).

## Sources

- CJEU, C-210/16 *Wirtschaftsakademie Schleswig-Holstein*, 5 June 2018, ECLI:EU:C:2018:388 (fan page administrator
  and Facebook as joint controllers): <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62016CJ0210>
- CJEU, C-40/17 *Fashion ID*, 29 July 2019, ECLI:EU:C:2019:629 (joint control limited to the operations decided
  together): <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62017CJ0040>
- GDPR, Regulation (EU) 2016/679, Art. 2(2)(c), 12, 13, 14, 26 and recital 18: <https://eur-lex.europa.eu/eli/reg/2016/679/oj>
- CJEU, C-212/13 *Ryneš*, 11 December 2014, ECLI:EU:C:2014:2428 (the household exemption is narrow, "purely"
  personal): <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62013CJ0212>; C-101/01 *Lindqvist*,
  6 November 2003 (publishing to an indefinite number of people is not household activity):
  <https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62001CJ0101>
- BVerwG, 6 C 15.18, 11 September 2019 (German follow-up to C-210/16):
  <https://www.datenschutzzentrum.de/uploads/facebook/20190911_Urteil-BVerwG.pdf>
- Datenschutzkonferenz, decision on Facebook fan pages, 23 March 2022:
  <https://www.datenschutzkonferenz-online.de/media/dskb/DSK_Beschluss_Facebook_Fanpages.pdf>
- VG Köln, 13 K 1419/23, 22 July 2025 (report):
  <https://www.lto.de/recht/nachrichten/n/13k141923-vg-koeln-bfdi-facebook-bpa-meta>
- § 5 DDG (Digitale-Dienste-Gesetz, in force since 14 May 2024, replacing § 5 TMG):
  <https://www.gesetze-im-internet.de/ddg/__5.html>; § 18 MStV: <https://www.gesetze-bayern.de/Content/Rtf/MStV-18?all=False>
- LG Aschaffenburg, 2 HK O 54/11, 19 August 2011, and OLG Düsseldorf, I-20 U 75/13, 13 August 2013 (provider
  identification of commercially used social media pages)
