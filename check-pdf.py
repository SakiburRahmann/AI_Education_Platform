import json
d = json.load(open("/home/sakiburrahman/code/AI_Education_Platform/package-lock.json"))
p = d["packages"]["node_modules/pdf-parse"]
print("version:", p.get("version", "?"))
exports = p.get("exports")
if exports:
    for k, v in exports.items():
        print(f"  {k}: {v}")
else:
    print("no exports")
# Check main
print("main:", p.get("main", "?"))
