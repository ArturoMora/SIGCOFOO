using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    public class BitacoraSISTEMA_DB { 
    // Obtención del string de conexión desde el Web.config
    protected static String connectionString = null; //ConfigurationManager.ConnectionStrings["MongoDB"].ConnectionString;
        protected MongoDB.Driver.Core.Configuration.ConnectionString con = null; //new MongoDB.Driver.Core.Configuration.ConnectionString(connectionString);

    //El objeto cliente que manejará la conexión
    public MongoClient client;

    //La interfaz que manejará la base de datos
    public IMongoDatabase bitacoraDB;

    public BitacoraSISTEMA_DB(String connection)
    {
            con= new MongoDB.Driver.Core.Configuration.ConnectionString(connection);
            BitacoraSISTEMA_DB.connectionString = connection;
        //Se abre la conexión y se accede a la base de datos
        this.client = new MongoClient(connection);
        bitacoraDB = this.client.GetDatabase(con.DatabaseName);

    }
}
}