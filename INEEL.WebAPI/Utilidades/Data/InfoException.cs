using INEEL.DataAccess.GEN;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace INEEL.WebAPI.Utilidades.Data
{
    public class InfoException : System.Exception
    {
        private String id;
        public InfoException(String message) : base(message)
        {
            id = message;
        }
        public InfoException(long message)
        {
            id = message.ToString();
        }
        public InfoException(Fechas message)
        {
            id = message.Fecha.ToString();
        }
        public InfoException(Boolean message)
        {
            id = message.ToString();
        }

        public override string ToString()
        {
            return id;
        }
    }
}