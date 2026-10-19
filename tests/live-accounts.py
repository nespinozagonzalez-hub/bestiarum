"""Exercise the deployed service using a new, clearly named QA account.

No PIN or session token is printed or saved. Run only for an authorized deployment.
"""
from pathlib import Path
import datetime,json,re,secrets,uuid,urllib.request

root=Path(__file__).resolve().parents[1]
url=re.search(r"url:'([^']+)'",(root/'assets/js/config.js').read_text()).group(1)
checks=[]
def check(text):
    checks.append(text)
    print('PASS',text,flush=True)
def request(action,token=None,**values):
    payload={'action':action,**values}
    if token:payload['token']=token
    req=urllib.request.Request(url,data=json.dumps(payload).encode(),headers={'Content-Type':'text/plain;charset=utf-8'})
    with urllib.request.urlopen(req,timeout=45) as response:return json.load(response)
def success(action,token=None,**values):
    result=request(action,token,**values)
    assert result.get('ok'),result.get('message','Request failed')
    return result
with urllib.request.urlopen(url,timeout=30) as response:health=json.load(response)
assert health.get('ok') and health.get('ready')
check('Servicio público instalado y accesible')
username='qa_bst_'+datetime.datetime.now(datetime.timezone.utc).strftime('%m%d%H%M')+'_'+secrets.token_hex(2)
pin=f'{secrets.randbelow(1000000):06d}'
registered=success('register',username=username,pin=pin,profile={'player':'Prueba conexión Bestiarium','avatar':'hunter-2','specialty':'guardian','origin':'pantano'})
token=registered['token'];assert registered['state']['captures']==[]
check('Cuenta de prueba creada con usuario y código de seis números')
success('hunt',token,code='GREMIO-PANTANO',requestId=uuid.uuid4().hex)
capture=success('capture',token,code='NUCLEO-7',requestId=uuid.uuid4().hex)
assert capture['state']['captures']==['virulox'] and capture['state']['xp']==50
check('Contrato y captura guardados realmente con 50 XP')
duplicate=success('capture',token,code='NUCLEO-7',requestId=uuid.uuid4().hex)
assert duplicate['state']['xp']==50 and len(duplicate['state']['captures'])==1
check('Captura repetida no duplica progreso ni recompensas')
crafted=success('campaign',token,operation={'type':'craft','id':'farol'},requestId=uuid.uuid4().hex)
assert crafted['state']['campaign']['crafted']==['farol']
success('campaign',token,operation={'type':'read','id':'prologo','page':2},requestId=uuid.uuid4().hex)
check('Forja y página de lectura guardadas en Google')
other=success('login',username=username,pin=pin);other_token=other['token'];state=other['state']
assert state['xp']==50 and state['captures']==['virulox'] and state['campaign']['pages']['prologo']==2 and state['campaign']['equipped']['mano']=='farol'
check('Nueva sesión independiente recupera cazador, captura, equipo y lectura')
success('logout',token)
assert request('state',token).get('code')=='SESION_INVALIDA'
assert success('state',other_token)['state']['xp']==50
check('Cerrar una sesión revoca su acceso y conserva la otra sesión')
success('logout',other_token)
report={'date':datetime.datetime.now(datetime.timezone.utc).isoformat(),'method':'Peticiones reales al Apps Script desplegado, dos sesiones independientes','serviceVersion':health.get('version'),'qaUsername':username,'checks':checks,'limits':['Prueba de API; la revisión del formulario y CORS en navegador se registra por separado.']}
(root/'docs/live-connection-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('COMPLETE',len(checks),'live connection checks',flush=True)
