import os
from . import app

app.run(debug=os.environ.get('DEBUG'), host='0.0.0.0')
