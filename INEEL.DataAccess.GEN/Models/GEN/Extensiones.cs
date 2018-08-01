using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.MigrationsPI;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.PI.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Models.GEN
{
    public static class Extensores
    {
        public static Boolean IsNotNull(this Object objeto)
        {
            return objeto != null;
        }

        public static Boolean Existe(this Object objecto, DbSet<TipoPropiedadIndustrial> dbsetrama)
        {
            return false;
        }
        public static Boolean ExisteEn(this Object objecto, List<string> listaenbd, string campo)
        {
            Type t = Type.GetType(objecto.GetType().FullName);

            if (t.GetProperty(campo) != null)
            {
                string palabraaagregar = t.GetProperty(campo).GetValue(objecto).ToString();

                foreach (var nombre in listaenbd)
                {
                    if (RemoveDiacritics(nombre.Trim().ToLower()) == RemoveDiacritics(palabraaagregar.Trim().ToLower()))
                    { return true; }
                }
            }
            return false;
        }

        public static Boolean ExisteEn(this Object objecto, List<string> listaenbd)
        {
            Type t = Type.GetType(objecto.GetType().FullName);

            if (t.GetProperty("Descripcion") != null)
            {
                string palabraaagregar = t.GetProperty("Descripcion").GetValue(objecto).ToString();

                foreach (var nombre in listaenbd)
                {
                    if (RemoveDiacritics(nombre.Trim().ToLower()) == RemoveDiacritics(palabraaagregar.Trim().ToLower()))
                    { return true; }
                }
            }
            return false;
        }

        static string RemoveDiacritics(string text)
        {
            text = ReducirEspaciado(text);
            return string.Concat(
                text.Normalize(NormalizationForm.FormD)
                .Where(ch => CharUnicodeInfo.GetUnicodeCategory(ch) !=
                                              UnicodeCategory.NonSpacingMark)
              ).Normalize(NormalizationForm.FormC);
        }

        public static string ReducirEspaciado(string Cadena)
        {
            while (Cadena.Contains("  "))
            {
                Cadena = Cadena.Replace("  ", " ");
            }

            return Cadena;
        }
    }
}
