using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.GEN;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Configuration;
using INEEL.DataAccess.Models;

namespace INEEL.DataAccess.GEN.Repositories
{
    public class RecuperaPasswordRepository : IDisposable
    {

        private GEN_Context _db;
        public RecuperaPasswordRepository()
        {
            _db = new GEN_Context();
        }

        public async Task<string> GetGeneraCodigo(string clavepersona)
        {
            try
            {
                var codigo = await Create(clavepersona);
                byte[] bytes = Encoding.UTF8.GetBytes(codigo.ToString());

                var sha1 = SHA1.Create();

                byte[] SHA256Result = sha1.ComputeHash(bytes);
                StringBuilder stringBuilder = new StringBuilder();

                foreach (byte b in SHA256Result)
                    stringBuilder.AppendFormat("{0:X2}", b);

                string hashString = stringBuilder.ToString();
                return hashString;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Boolean> ValidarCodigo(string clavepersona, string codigo, string password)
        {
            try
            {
                var registo = await _db.RecuperaPassword
                    .Where(e => e.ClavePersona == clavepersona
                    && e.Activo == 1
                    )
                    .FirstOrDefaultAsync();
                if (registo == null)
                {
                    throw new Exception("No existe solicitud.");
                }

                DateTime oldDate = registo.FechaRegistro;
                DateTime newDate = DateTime.Now;

                // Difference in days, hours, and minutes.
                TimeSpan ts = newDate - oldDate;

                // Diferencia en minutos.
                int dif = ts.Minutes;
                if (dif > registo.ValidezenMinnnutos)
                {
                    var resp = Desactivar(registo);
                    throw new Exception("La solicitud ha expirado.");
                }


                byte[] bytes = Encoding.UTF8.GetBytes(registo.RecuperaPasswordId.ToString());

                var sha1 = SHA1.Create();

                byte[] SHA256Result = sha1.ComputeHash(bytes);
                StringBuilder stringBuilder = new StringBuilder();

                foreach (byte b in SHA256Result)
                    stringBuilder.AppendFormat("{0:X2}", b);

                string hashString = stringBuilder.ToString();
                if (codigo != hashString)
                {
                    var resp = Desactivar(registo);
                    throw new Exception("El codigo es incorrecto para esta solicitud.");
                }
                AccesoSistemaRepository sistema = new AccesoSistemaRepository(_db);
                var respuesta = await sistema.ChangePassword(new UserModel()
                {
                    UserName = "u" + clavepersona,
                    Password = ConfigurationManager.AppSettings["passwordgenerico"],
                    ConfirmPassword = password
                });

                if (respuesta != null)
                {
                    var respuestadesactivar = Desactivar(registo);
                    return true;
                }

                return false;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        public async Task<int> Create(string clavepersona)
        {
            try
            {
                RecuperaPassword rp = new RecuperaPassword()
                {
                    FechaRegistro = DateTime.Now,
                    ValidezenMinnnutos = int.Parse(ConfigurationManager.AppSettings["recuperarpasswordmin"]),
                    Activo = 1,
                    ClavePersona = clavepersona
                };

                _db.RecuperaPassword.Add(rp);
                await _db.SaveChangesAsync();
                return rp.RecuperaPasswordId;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<int> Desactivar( RecuperaPassword recup)
        {
            try
            {
                var rp = await _db.RecuperaPassword
                     .Where(e => e.RecuperaPasswordId == recup.RecuperaPasswordId)
                     .FirstOrDefaultAsync();
              

                if(rp != null)
                {
                    recup.Activo = 0;
                    _db.Entry(rp).CurrentValues.SetValues(recup);
                    await _db.SaveChangesAsync();
                }
                return rp.RecuperaPasswordId;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public void Dispose()
        {
            _db.Dispose(); //ayudar al recolector de basura
        }
    }
}