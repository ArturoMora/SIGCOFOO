using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace INEEL.DataAccess.GEN.Util
{
    public static class SimpleSessionPersister
    {
        static string PersonaIdSession = "UsuarioId";
        static string nombreUsuarioSessionVar = "NombreCompleto";
        public static String getUrlReferrerAbsoluteUri
        {
            get
            {
                if (HttpContext.Current == null) return null;
                object sessionVar = null;
                try
                {                    
                    sessionVar = HttpContext.Current.Request.UrlReferrer.AbsoluteUri;
                }
                catch (Exception e) { }
                if (sessionVar != null)
                    return sessionVar as String;
                return null;
            }          
        }
        public static Uri getUrlReferrer
        {
            get
            {
                if (HttpContext.Current == null) return null;
                object sessionVar = null;
                try
                {
                    sessionVar = HttpContext.Current.Request.UrlReferrer;
                }
                catch (Exception e) { }
                if (sessionVar != null)
                    return sessionVar as Uri;
                return null;
            }
        }
        public static String PersonaId
        {
            get
            {
                if (HttpContext.Current == null) return null;                
                object sessionVar = null;
                try
                {                    
                    //sessionVar = HttpContext.Current.Session[PersonaIdSession];
                    sessionVar = HttpContext.Current.Request.Headers.Get(PersonaIdSession);                    
                }
                catch (Exception e) { }
                if (sessionVar != null)
                    return sessionVar as String;
                return null;
            }
            set
            {
                try
                {
                    HttpContext.Current.Request.Headers.Set(PersonaIdSession, value);
                }
                catch (Exception e) { }
                
            }
        }


        public static String nombreUsuario
        {
            get
            {
                if (HttpContext.Current == null) return null;
                object sessionVar = null;
                try {
                  sessionVar=HttpContext.Current.Request.Headers.Get(nombreUsuarioSessionVar);
                }catch(Exception e) { }
                if (sessionVar != null)
                    return sessionVar as String;
                return null;
            }
            set {
                try { 
                HttpContext.Current.Request.Headers.Set(nombreUsuarioSessionVar, value)  ;
                }catch (Exception e) {}
            }
        }
    }
}