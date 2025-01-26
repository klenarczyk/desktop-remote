# Navigate to backend directory and start Flask server
Write-Host "Starting Flask backend..."
cd ./backend
if (!(Test-Path ".venv")) {
    Write-Host "Creating virtual environment..."
    python -m venv venv
    .\venv\Scripts\activate
    Write-Host "Installing dependencies..."
    pip install -r requirements.txt
} else {
    .\.venv\Scripts\activate
}
Write-Host "Running Flask server..."
Start-Process -WindowStyle Minimized -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "python app.py" # -WindowStyle Minimized
cd ..

# Navigate to frontend directory and start React server
Write-Host "Starting React frontend..."
cd ./frontend
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..."
    npm install
}
Start-Process -WindowStyle Minimized -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "npm run dev" # -WindowStyle Minimized
cd ..

Write-Host "Both servers are now running!"
