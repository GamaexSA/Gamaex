#!/usr/bin/env python3
"""Sube los ZIPs de deploy al servidor cPanel via FTP."""
import ftplib
import os
import sys

HOST = os.environ.get("FTP_HOST", "")
USER = os.environ.get("FTP_USER", "")
PASS = os.environ.get("FTP_PASS", "")

DEPLOY_DIR = os.path.join(os.path.dirname(__file__), "..", "deploy")
ZIPS = ["gamaex-api.zip", "gamaex-admin.zip", "gamaex-web.zip"]

def upload_file(ftp, local_path, remote_name):
    size = os.path.getsize(local_path)
    uploaded = [0]
    print(f"  Subiendo {remote_name} ({size // 1_048_576} MB)...", flush=True)

    def progress(block):
        uploaded[0] += len(block)
        pct = uploaded[0] * 100 // size
        print(f"\r  {pct}% ({uploaded[0] // 1_048_576}/{size // 1_048_576} MB)", end="", flush=True)

    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_name}", f, 8192, progress)
    print(f"\r  ✓ {remote_name} subido                    ")

def main():
    print(f"Conectando a {HOST}...")
    try:
        ftp = ftplib.FTP(HOST, timeout=60)
        ftp.login(USER, PASS)
        print(f"✓ Conectado. Directorio: {ftp.pwd()}")
    except Exception as e:
        print(f"✗ Error de conexión: {e}")
        sys.exit(1)

    for zip_name in ZIPS:
        local = os.path.join(DEPLOY_DIR, zip_name)
        if not os.path.exists(local):
            print(f"  ⚠ No encontrado: {local}")
            continue
        try:
            upload_file(ftp, local, zip_name)
        except Exception as e:
            print(f"  ✗ Error subiendo {zip_name}: {e}")

    ftp.quit()
    print("\n✓ Upload completado.")
    print("\nPróximo paso → cPanel File Manager:")
    print("  1. Ir a File Manager → Home")
    print("  2. Click derecho en cada ZIP → Extract")
    print("  3. Eliminar los ZIPs después de extraer")

if __name__ == "__main__":
    main()
