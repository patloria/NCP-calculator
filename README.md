NCP calculator
==================
The NCP calculator returns an author's average citations per paper (CPP) and their normalized citations per paper (NCP). Calculations are based on citations in the evaluation year to papers published in the previous 3 years. Citation data is derived using Scopus APIs.

Developers
==================
- [Pat Loria] (mailto:pat.loria@usq.edu.au) ([@pat_loria] (https://twitter.com/pat_loria)) (creator)
- [Tim McCallum] (mailto:timothy.mccallum@usq.edu.au) ([facebook] (https://www.facebook.com/mistermac2008)) (programmer)
- [Pawel Pohorski] (mailto:Pawel.Pohorski@usq.edu.au) (programmer)

Definition of normalized citations
==================
Based on the Scopus SNIP indicator, author citations are normalized using the relative database citations potential (RDCP) of the journals in which an author's papers are published. Whereas Scopus SNIP is defined as a journal's CPP divided by that journal's RDCP, NCP is calculated as the author's CPP divided by the average RDCP of the author's journal outlets. As there is no Scopus RDCP API, the RDCP is reverse-calculated by dividing a journal's CPP by its SNIP.

Applications for using NCP
==================
- Compares relative citation impact of authors across research fields with different rates of expected citations (citations in fields with low citation rates are given a higher weighting; citations in fields with high citation rates are given a lower weighting)
- Provides a more comparative impact metric for research evaluation exercises
- Compensates for database variations in subject and format coverage

System and code requirements
==================
- Any Linux operating system with [NodeJs] (http://nodejs.org/) installed
- Your institution must have a current Scopus subscription
- The USQ Scopus API key must be replaced with your institution's [API key] (http://searchapi.scopus.com/home.url)
- The USQ ezyproxy URL must be replaced with your institution's ezyproxy URL or equivalent

Known bugs
==================
- Calculations may take a long time (average is 30 mins per author per year) as an API request needs to be made for 25 journal publications at a time (for the calculation of the journal's CPP)
- The calculator currently crashes for journals (such as proceedings) with more than 5,000 publications per annum
- There is currently no data output functionality (best current workaround is to copy and paste tabular output into Excel)

Instructions for end users
==================
- Enter an author's Scopus ID and in the Author ID field
- Enter a year in the Eval Year field
- Click on Calculate (go and have a cup of coffee)
- When calculation is complete, additional authors or years can be added to the output table during a current session (data is currently lost if you navigate away from the page)

External links
==================
- Information on registering for a [Scopus API] (http://searchapi.scopus.com/home.url)
- Further information on the [Scopus SNIP] (http://www.journalmetrics.com/snip.php) indicator
