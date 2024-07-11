if ["$NODE_ENV" = "development"]; then
    echo "API inicializado em ambiente de produção"
    npm start
else 
    echo "API inicializada em ambiente de desenvolvimento"
    npm run dev
fi