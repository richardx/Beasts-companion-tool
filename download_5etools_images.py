import os, re, json, shutil, pathlib

SRC_ROOT = pathlib.Path("5etools-img/bestiary")   # din klon
DST_ROOT = pathlib.Path("beast_images")           # hvor du vil have dine filer
DST_ROOT.mkdir(exist_ok=True)

# 1) indlæs listen over dyr
with open("dnd_2024_beasts_normalized.json", encoding="utf8") as f:
    beasts = json.load(f)

# 2) lille hjælper til at sammenligne fil- og dyrnavne
def norm(s):  # a-z, 0-9 – alt andet fjernes
    return re.sub(r"[^a-z0-9]", "", s.lower())

# 3) find og kopier
for beast in beasts:
    wanted = norm(beast["name"])
    found = None
    # gennemsøg kun kildebøger vi ved rummer dyr (MM, ToA, VGtM …)
    for path in SRC_ROOT.rglob("*.*"):
        if norm(path.stem) == wanted:
            found = path
            break
    if found:
        dst = DST_ROOT / f"{beast['name']}{found.suffix}"
        shutil.copy2(found, dst)
        print(f"✓ {beast['name']}")
    else:
        print(f"✘ {beast['name']} - INTET billede fundet")

print("Færdig!")
