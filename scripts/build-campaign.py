"""Embed the same reviewed campaign engine in Apps Script and UI in controller."""
from pathlib import Path
root=Path(__file__).resolve().parents[1]
for target,source,start,end,anchor in [
 ('assets/js/app.js','assets/js/campaign-ui.js',' // BEGIN CAMPAIGN UI',' // END CAMPAIGN UI'," document.addEventListener('click',e=>{"),
 ('backend/Code.gs','assets/js/campaign.js','// BEGIN SHARED CAMPAIGN','// END SHARED CAMPAIGN',None)]:
 p=root/target;s=p.read_text();block=start+'\n'+(root/source).read_text()+'\n'+end+'\n'
 if start in s:
  a=s.index(start);b=s.index(end,a)+len(end)+1;s=s[:a]+block+s[b:]
 elif anchor:s=s.replace(anchor,block+anchor,1)
 else:s+='\n'+block
 p.write_text(s)
