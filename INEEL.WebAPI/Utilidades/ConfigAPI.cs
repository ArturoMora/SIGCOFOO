using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace INEEL.WebAPI.Utilidades
{
    public static class ConfigAPI
    {
        public static String cultureName
        {
            get
            {
                try
                {
                    return  ConfigurationManager.AppSettings["cultureName"];
                }
                catch (Exception e) {
                    return null;
                }
            }
        }
    }
}