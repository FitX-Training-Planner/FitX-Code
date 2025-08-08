import os
import importlib

def main():
    works_folder = os.path.join(os.path.dirname(__file__), "works")

    jobs = [
        f[:-3] for f in os.listdir(works_folder)
        if f.endswith(".py") and not f.startswith("_")
    ]
    
    for job_name in jobs:
        module_path = f"works.{job_name}"
        module = importlib.import_module(module_path)
        
        module.run()

if __name__ == "__main__":
    main()
