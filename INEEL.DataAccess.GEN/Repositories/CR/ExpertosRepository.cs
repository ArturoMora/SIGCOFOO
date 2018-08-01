using INEEL.DataAccess.GEN.Contexts;
using INEEL.DataAccess.GEN.Models.CR;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using INEEL.DataAccess.GEN.Models.GEN;
using INEEL.DataAccess.CR.Models;

namespace INEEL.DataAccess.GEN.Repositories.CR
{
    public class ExpertosRepository : IDisposable
    {
        /// <summary>
        /// Contexto para conexiones CR
        /// </summary>
        CR_Context _cr;
        GEN_Context _gen;
        SIGCOCHContext _ctxCH;

        /// <summary>
        /// Contrucctor de la clase IdiomasRepository
        /// </summary>
        public ExpertosRepository()
        {
            _cr = new CR_Context();
            _gen = new GEN_Context();
            _ctxCH = new SIGCOCHContext();
        }


        public void Dispose()
        {
            ((IDisposable)_cr).Dispose();
            ((IDisposable)_gen).Dispose();
        }
        public async Task<int> countByStatus(Boolean estadoFlujo)
        {
            try
            {
                return await (from t in _cr.Expertos
                                  //.Where(f => f.eso)
                              select t).CountAsync();
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener toda la lista de expertos 
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Experto>> GetAll()
        {
            try
            {
                //Obtener expertos con su linea de desarrollo 
                var expertos = await _cr.Expertos
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .Include(e => e.Comunidad)
                    .Where(e=>e.TipoExperto==2)
                    .AsNoTracking().ToListAsync();

                PersonasRepository p = new PersonasRepository(_gen);
                var clavesInv = await _cr.InvestigadorPorExperto.AsNoTracking().ToListAsync();

                //Obtener la informacion de los expertos del catalogo de contactos 
                HashSet<int> contactoids = new HashSet<int>(
                        expertos.Select(e => e.ContactoId));
                ContactosRepository contactos = new ContactosRepository(_cr);
                var contactoslista = await contactos.GetContactos(contactoids);

                //relacionar cada experto con las persona que interactua

                foreach (var experto in expertos)
                {
                    experto.Contacto = contactoslista.Where(e => e.ContactoId == experto.ContactoId).FirstOrDefault();

                    //Obtener los investigadores con los que interactuan 
                    List<String> clavespersonas = new List<string>(
                              clavesInv.Where(e => e.ContactoId == experto.ContactoId).Select(e => e.ClavePersona));
                    var investigadores = await p.GetAllCollectionWithoutStatus(clavespersonas);
                    experto.Investigadores = investigadores;

                }


                return expertos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        /// <summary>
        /// Obtener listado de expertos por comunidad
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Experto>> GetByComunidad(int id)
        {
            try
            {
                //Obtener expertos con su linea de desarrollo 
                var expertos = await _cr.Expertos
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .Where (e => e.ComunidadId == id)
                    .AsNoTracking().ToListAsync();

                PersonasRepository p = new PersonasRepository(_gen);
                HashSet<int> contactoids = new HashSet<int>(expertos.Select(e => e.ContactoId));

                ContactosRepository contactos = new ContactosRepository(_cr);
                var contactoslista = await contactos.GetContactosCP(contactoids);
                foreach (var _contacto in contactoslista) {                   
                    try
                    {                    
                        var archivo = _contacto.Adjunto.RutaCompleta;

                        Byte[] bytes = File.ReadAllBytes(archivo);
                        String file = Convert.ToBase64String(bytes);
                        _contacto.Adjunto64 = file;
                    }
                    catch (Exception)
                    {
                        _contacto.Adjunto64 = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAdkklEQVR4XuzSIQ4AIBADQf7 / 1h5vIDkDDkWCmFEVlTvqARAWwkJYCAuEhbAQFggLYSEsEBbCQlggLIT1OYSFsBAWSarNdrvtZ1q1c7PaO / PeOI5r7fep7h5yuEikSG2OFltObOsfxy8Q3Avcz3VvnNx8wiA3SHxvEG / aF0qkbHFfZqt6f6gHLIxHAkRSVNgzrEdUs6bYJGa6nz7n1NmqKjKKwg7BOISgGeccY + 99iHARxRD0UybT7wJmOGYY5MrEqqqKY + LQMOHSQEg / 1SCRT5NpPiNLrMSGUVk1ItIGg0Gv15N80pH5fr + fuGgRRUYmliB + cBzWhmmQJBlkarfbIULzaVCWZWIV / OOYUX799dfF + YX4UYRoKlVVCeAKkol5F4kyQjgdhsFvVVUtkSaCCm + VXmZZYk0KghXG / 7ff0ajXOIGDIZl8t3Owv79 / cNDh2O12IUq30 + l0O71eP4qi4Bw0quqqciWDcmZmdnp6Kh6nmXfO6lYrCjmJOR9paMxbYQOmfIC9sJMTEvOSJs3EGiOJBCpXVwxlD0UDvKgiYFKncwBzdiI2Nja3trZ4WXCGcRgxx / kmmAbmDGkF4ZiYak3Nzc222zMXL16Ynm7PzMy029Nl1YrK0UNszoZvkMjKyvd7ECutGGSxMcirwvGBucLVQeaQDPNDo3tvb299fZ2PD5kYQzLZ5BxQiLwcMPN2rSbOBc0PW10ANVrV9fzc3KWI + fn5CxcumLmoJYM4VFqAR / 1BD84xI4ZxQibW + AgsV3Lvur1uq9VCWyGNoNFmBJTa3d2FEHVdW4QzC1GEIISOvsQTVyAWvwUd + WvpLzCGNAsLC9euXbty5QovoR1n1qUVHgxEWmlN2FyMDTKxrERiWWlhELa2t1ZXV1 + 9erWxsSEBI + HE0UcML / dEl6OwasRISn8kzYttCwuL165dXV5eRkUyFQY9sUrvYfIkVjXZBhasMecwnVYiUHkWgSCRj0DuTd1gDYBU4TuNHtFiEJF + N80nbiEsmfnpp1dra6uLi4s3bty4fvXyHJ6LIiDAWCJIsGV3wzhAd7d0LPDu33 / 4w48 / vHz5Ug4nBIM4NEyINBCO7kDXaRJ7AjMWwXiYahJL0GhjYx1lDJ1ZTgLpUP1WVoWNgFQMDIArSKAQIWEjAfDs2bMHDx9tbe / 1w8AK08myfkbWe5pJlDoBiUfYNuLEFxhbYb7wod + bbrWuX79269YtLDC4juhCsEkbioJ6n5lYZwAFWEQp3cKDgwMZ6RhSz58 / X1tb29nbc65VOBMRm + EuCqhJPA7Q7Pr165988gnckgkPsfRsnGXMMRMrqaFEMskknAgPHjxYfbnqg6 / qli / KUDTqJoXSChcCa1UmsLru3Llz9epVpKw0cnpOGGcb6wyAcNLVl5YpI8iI + vbbbxHDrakWX3DPe3k0mwMrguettlo1JtfO7i5efmbn5ub0KZJ6HWuh5YqxBWEWqY + 08nr8 + DGswpvA2JnzAzjX0IceqwrLiqj23OwsTv9Hjx69ePGCRasNuzDOBJlYxHwRU3zJaU4 + J7cHzycKkdUWiibqxzJYA1eszlUlxyRot3d27t +/ j / N2cOZ8yn4sV1aFlT7066n2xub2dz / c29jaiUaV9QaBo1k5CNAqNNBvG8yK + D5D4L / Vrand / c4P9x64qsZHH7y09yAb72dgqHjvvBlKEA2Ctf7kyRPUIuIq + KBAnnyk1lTnrQ29Oam / fq9 / +fLlu3e / WLx0aW93p7KzSLPJqjCFZfBXoQQZy / VQWMp7YthQmP5rbIbWZklYt + qVFytPnz1TxkS2sc6GVWVV4rLCpf706VOiy1objulnMbPkacOK51Fp1a2z + ThZYpk5 + PTw0cPt7W3yn8Y6OyAFLkmz2d / bRwDv7u2dicDNxDKk1pMnTzfWN4gnp2jMBJR1uNLxqDx69DDNZGJ9QKRUFgbKNCcN5uWLFxjsZANLm4w1n5KxpfDiixcvyRzDapRC / FDBqEwsM0vEkpH +/ PkKrkXZJSqCmKQqNJzy2I5Y8You8AEzsT4IUla4As84QslwOugcWITSYCanWNQMfhFKlzMoRQ9zrPD0MZzqxMTTZ09fvlhjdigXYNLQ63TqusJfqlygDyuVcxDauWjbPn500OlNTU2Hw1KqCcsZd85KMyzIpaWl2dlZNOPpP0JZFSqBOCkFldaYFWIVEKsYTBa3SoIKJJZh0RP9hGT6gJlYH4ph66 / XeYL9wBNolrgSqyZJIcaEHxBWV9eoJiJU9YYR6XOs8NSMd + ccV / nPf / 5zp9t1Za1Y7aSiCqZa6q / +32 / JYybNJhpbA1inQHYRLIoGyxLrveAiSLeK + eBwys5BDxzjC73PR5aTpRBMR16GrApPId7svSdHVEUHk84rKBOk5V +/ Xid49aFWhVlimVnssLChMRd + smGFSSqzCqavxOmzKhNLD67Wg3p2GYdJZ5YrnfyilLXSGFUVkSFkYn2AQkIc7goawqnzILEktaKZtQ2xTj + qk20sM6NskCWhGDbQVZ5ghKLX7zFQpeHOzvbu7k5ZVkxkYp3ykrAToYlkyU4sLI1M0pp2cB + k6CgHoRFXCC0GkViVD36yPQ5WDJcWGhILF7yZy8Q6NahvB0vCZGcYhwkXWAaCT3lmYXNzi2LEU14OZ2LxsPLI / sLqcloYTjKz / JDui89Vz53up86qsAu6vWi9WoyjBWdusk0ss + FGqAVmgPdePyk0HeL4RMhpM9DIMNUPDrqPHj4xc8TKqqqFrA3AikmGj9wCgW / mB / 7CxYtk0aAQnSuZMTt5WmmWWKZjv + epvXNWhcCUMysZTHq / Zxefn / SAGZ3CeWnm + OJHFpFL7E8I5bmjCJSApSAaOIc7SWENqCFbCP50aniyg3Rvfy + VsvBdFc / nDfv7e4PBeAR23LhIrL1diJWIJl7Z + SPWvjwOugRC8T7IEgstIELJ / jhvqlCmVLfTjdGtLLHeO51BR8DDGiIYx2NxrgCT5NbC1lRaKS8zsU6836mlejokVjTah5kHzh29Oh15s4JzmVjHhCyH4bWPcpGVQ5Iu8fmEtt + RlxhkP9ZxEVKbBgax0eiozXG + IA5FW9PMvVcTlGy8 / 5JYaoJ3CEbnD9ol5eRKMKtCySTvg0VoE0rx6TyDC5MyZ07oa8jGO + xyzlKRKi / zTt5pe54TBnMysUQmbYIKmMniCpSuBDHr38pYapEdpCfByEXL6A / 6aoOrdgIWkYmV8b6Zf / 0 + pOp7709vf / JMrAzjEHwQ3qO4PhNr1B1qxblG0GbpKQ3r / Qys7MeSzM8mVyiCixCvGo6q4S1AzDh6rYAKYOd6bahNneQrVsbfsVuxZWKlF4O4d9ypOdwzctqMltQ8o3VVv2 + IMCMTK6XKeB + 0k2p7pm0jJarvybCMvCrU1vNpMuPkcfgchMbFHJVgxQQ5k3Qe88EzE9I15SReTTTiBwxvUsmc4 + vYZkFubmtmPm4NUFU1jSEfPXz0ev016d6j / LNi4qFnJy2HvR / MzM5iG9y8efOj69e4QoN + x5llYh3VEejKFhY7bdbYKZn9 + xSHzspPHec6Bwdsef / FF1 / cvHmj3 + lY4bMqPAKsUCcMH8LKygpbQtITq65ry8RSL3vvkVj0UWbL / s2tLXM5CH10eRUHO9vb7FLk43WUZytDixgzY + PPn3 / 6efXlS / Xozg7SI0E53XRHpnFPu91WD6PMLYDkds6xmmHPYhpJbu / sWJEl1nHKKFTvJYe7jprMEgvALa4JQgsjgd1A4z5CIRPrnTBtX6sK1X5MQRKrMtKun6lHSL / XN5WCZWIdaUeGwrqov4iUgJuR9piV0JL0ClkVHj1VUs + lWCUVkLmVdqoCYpgnRzl4y9kNR4cPXi6GkcrMLLGQUhro6CxLrGMgBB / a09NaSwNdx4SMEDHdbscd / I / qPc6xQr4CjobkpEkO0gwzS9vJzrTbU1Ot7Mc6RtFA6RzXrFVV / W7PQamBV0BW5GLIwNvkF0 + o9TYDgZeOGe8HoVf4MNOarlyJV + aoAitnkLrC5tqzM9Ptve3dOm6HPCxdTcdJj0M7P5p4Zj6YYWb1sbSmW1OzMzNHTU3OqtCsUP8 + ttdeXFiU9Y5OtDdSG + xcmlbODMPACrswP3 / hwoWcj3UMA0tlFIwvX74MvfYPDt40IyycXx8pgGGwam5 + PhPr6AguAqHFtYNbsOpN5 / v55FXqajE7O7uwsFAfJwKdbSxL / gUz + 9WvfkVsh4D0WzTmuSSWvKMfffTR8vJlTC1emmWJdQxpH1hUM1hcXLx27RpWRXIMpqd2uJhHx8mjkXKwNVYYhyOy6vr16 + T6eQUkCst76RwR5gcByGcjbxZyS9ExzRz2uTU5o2WWcfKk5SVbwUMlY8B7zxHb4LPPPltYuMjLw5NCllhHDVxgs6tDJHTB0vrNb37z + eefI73gELkiHAO0Us1FXDNCKbg1YQtAZaF1ImRl / vrXv / 7000 + RVXx8ZqBdzsc6BpQtI8ZArNgcsfj449tfffXVl19 + iRYgpxQazczOQCidP4EJWyHwMefn53nGLl68eOfOnd / 97ncQa3l5mRkZA37gc5XOsWDBuwhDA + hh1WtlOkA1VOHq2tqPD + 5DQV5CwYnKrjHz / f7SxcW7d +/ y0dCGkIysUXJHJdG5KpFVwcriiM0O86owmDnMKOiCCegiZLzjgIA6aEmuMtYWKZRuaAOLSSIWXNEnxaKKObQ8S12KK5mUxSl6heCPTqlMLOPgQ98HX7vKzLAwur0OJntdV650yH / EGK / MOeglAx + k1iuTgWhF9fmureQKs9ZUi1kz8xwLoeQs6JWJdSToSqHcPKHWYK7UTjLR3zywAOIEJrvyAbn00C4 + wWF8LS0XodWfmZVVGXdR9eZCaYJH / zEVQBJthc9b955YMybDXO4rdaFhBR6er6woudQ54zjWda0hIjGMZ + jS4sK1a1ehWoo1vCGSc0e / D7ArGKqBf4ir5OkpxhnDXl9xjOSFkQ8 + RnDjexvqqp6bn1OIg5mx1oMjliJL3dI50hdkFfwrXSqZWIU5I68m1VxAr7EWV8OpoYzbMzM4sbwPYeicLLH + BQj8Q2LJiZruyphCPuFUkoRyx73ebk8HLVTGDnKQjimtzNX7ne5f / vIXHDzcCfxekxEr5FPArbt3P79z6zbO4NzR7wyAC5FQ / 7gbWMDMpAR1RGLJwDobcZWJxQ3AN40jHvUBycbdxhJY5166dGmeSPMZ7HiWiRXdhWhEJBaxnRDhvR93Yin0ztNCP98zsNYzsSxWS5M2Q2iWgD9CCxtrrFWhAJlQ7kisM7Las8QKRelKmSNXrlxhAZUcWuPXsTvWjxgorNfrwyqWhL1OZ6wz + 6txXj2FAnXYLxbmZxYvXtjZ2nBwKTgfyDKtUCODfp / A9aCRMVoLv + R9zA8NPsxOTy0vLlSu8Gf3ZGQ / li + d73V3S1d8dO3KbLs96HVbtZVWuMAXyjKUzjWSVTGyHOzwK94GmNXvfXT96vLSou / 3xj0fduy91TEZsL8cIW1YVTX3SKlLTe0GbyMfpKwq5xz2IvmxNK1QVCcT6wyL7AptMlBV5fWPrmOakLylwhVgzpQY3jyEkQ9CYz7e6tWrVzGwGGgyE + ssM7dk9u7vHxA3pAhRpSxqUm38C2EsnhAtb9kWwDm3t7d3hqHPTCwlWBop71H9lQA9QkkP3KrKiiO8QhsWzVaFcjHw9qlBpQyJVWHKzcrEOht4H2KDI6Wb1ggqWEV1q5n1ItsavA + duhOZkmT0zhG32vWTh + GsiJWD0ED9snwcaoNk45agR7755v / WVl / Nzc1j / w6CL5yFxqkJZ6jrspDiwwlH1eTtj2 / GQreGZRvnXezNTN3Pb9++TToNldNM1s1ThQgrB6liwr5quJGyy5eX0ewNNdgzsbhPCK2lpSX6l8qd7UNo8t7ECm5iWtHsSpOZWA2F3D8UeFZ1JRlWWOOajfvgh3ucEJXyjaVVJpaaH3G0WIIno9gaGzUIISW + EkHnBZOZWE1asQeXxmUEiVnT01P9QZcqPCYaeMMsbo + qxnx1XfFuXWmJdIdfZ4MchAZO68GRNopolqkpDoRJXB + NY65pq1kHrSzge0OmtqamGXuPBvfKBuLl4VLXZYnVlKBbOpod3qTQwL4MeleqavZ8jYorjuazKmxWi07gIwIzDY0UKoIuY8sz8aaKz6qwoSXFHJv8DjmYGd + 8b76TPRNLQkvwzSaWyKRnoOElRlkVCoe88s1NPgmSUpaGTUcmlu7S7u5u3MzCmtkpxJWl2qaxdu12O3hxsyocD + c7pXmxNKHhS1n1bQ + xvihkidX0emLuk2RA8KG5ayyz5HwnXu59k82sLLEisQ46HSSWfERxsrldRkPhzWx3dweGNbg9X5ZY8dg5gFodXoQiWCO3RgkSrspVdBBrL4quBjfpy6oQEMZBFQ55txv5AJjJ2 + Bi995D5agfxochWC5Y / RDwRyn5DOYsJNVS9H3hXLG5tROstLIOPpiVvnkFq33vCRTyEa0sB6HodPvbu3sXLy6UtWMZqxR47wdFGLxLkRtfmVjHYhW0Ce + 4pqEKhQv2C0XYH / jNbYjlzEGpgQjXNMD1UJQcHQTyHn / D5vbuwqVlBXoC31yl / r3vjhgGd3S1k1WhHa8wL5V9liV2O6tCBQr5amb / GeWNqQyE98wbZmFoZj28bpphVWt2lEqQLLGOBXsHvUIM3bzNxqK7n / YFUZxE6 / kGEmsko3prawu7MHhvzultow3jwpbDOx6vTKxj4R2rOWgj5o3cofX19Yb3jBzZowUw2ImgkttLxGo + GfLvRN5A4DjNpZUaOvyV + GSReBrY8O6jjx8 / 5g4RKmGsjPJmEmvkpbb8pAxEMQNFOy0tbDnFHEddNjB8cZrZr7s6k04eBPI0Ft7mNXA + gh9CD3D4iyVH2b / mal + Y9ghRCxB2 + EWnwKdx6d8XIrSLJ + 8cv4NIFhPhq9oYx / 5G8SAjcqROOm1mkVp5D9MrHIKZyVeFEiQQIm1KaBFiTNpKtDwE06IX / OFXMKH29 / cOOt2Dg95BT + iJWJubm9wbBqlLbMN3NxkGshZu0WoGekEUqlhd8HVVMsPW4hypuRCHgDgExB5dzNTxgbEu8jmqhNaH17XQIwiGUvN0AqgYME14hlrhuN / 4OqRhgF9djOz2Bj0vcRX0yHIc91bv0uC6IC1X8KFqAKfqmnl2xGy3Z / jHbijUjCCkoyRDwlWimuilS5oeY5FvwoklsZz29hDDpBylEfqEkAeew9bW9uvXr9Fu + 3t7ONMlsTjBtFdvXQ04janhjY0ixjdmIFroUgRA1kNMiU + AXgaiPKNfN5Jsbo7a7zaAZ9qNXGTyEcM23IQTC0ppZ0c4JnGdrinSaAs2bfO1u7W5wzlJVwKNzZwEvFIwvZyNDCciOVHKTvt9ViDYm43gJemBM / 6xU1XFxqAw7GIEu6Qg4Ea2BdX5k2pjQQNLG8VUpSurKjKsB5fWkUybm8gntF4MkjnopEpOWV2yap1ZKLzkFjWDVV0bfyg4EWtidsGUInMxVQtSjBCrijuCHhqpPUQ7qYI4WV68eDETweoytpGup6fbWiRBRi / 7fUwlVlDNnFlS6nFoaUYGhJQal + P16 / XV1VUuCs + oTjg821ncBFJ / ExKpwVpyACmy3I9p7SOLoHHfBTNVsIG6rFwhaiV6JYMpnQj7BmleR / iE9LoUwYCCWMS / j9DejrqYeim9EUuxPfxtHrHMzNUYQ1ABeXToIEDeeGlAcwZFeMS2d7Zfra29evXT3t5uSnDjOCLcRiDOiFLptImHvV1vjmSgpdc2pPgCNMXsX15eunz5CgzDCItaMijcJaOCEczU + Y5JJhpILFdOdemyp66yRYGkTus1npftra3Nra0XKytEXeL6ZQCXUIh2qlosI4BoSWiZqU5JNHZjtwt6nGKEcXfMuV63Oywmq7pyMM73G0csqIF5zWJN75UZGUm4nTaj / fRThIzxJKJOXYVlmJkuKAQqnfORXigKOITEgmE01GTLBex9LFdYxT1yrqROwLx3kn9NlFj9XqIOduXr1z + DV69eUTaTzFIw7NM6Xbs7Q0aIfKTyFYs9muQExrgnbty4QQQJAaZ1qA++NnPWSFVYuDpE9kAUhNPz58 / X1ta6XagW5L3UFo + M5QnMgurDeS6SxziJK2wsXXmgExBaKEcEGMHvUAQ0jhX + jIPQKdr1C2JZiaxilffPf / 7z++ +/ x7epgAxIC8OR + vdTrwPOgD0pFJvauwEGiVWco + ogTBTu16A / wBmGbf8vNd4hgZIFYDoDxfKSb3PYYNzeOXi28hxgV + mJedN + Si8zmT5o6sSIyfHmpG6ltkxrt / F / Td++cePK5SV8E2YO / qVMJLkeh2OUp0YsaWjlOclNAsPgO9YfApafwvpnKyurqz / v7O3CPHrhKzGyscZTRgqpmYJIpYNES5cWaA2Mi1U6VNJhxGhhfGo2lvguKSUuC7AKuw8n55Mnj39eXzerw5AMGysdl4VccMEHhEJ7 + kaEtvQZpqDGp5nznkgqo09jpalgS33zzf + urq6h2eF3iqWrZ2smFmh + 6o7sHG4fqgY98 + OPP / 7tb39j4ZVW7ikf7jSJJd0nlSxtiKZj / tmzZ3//+98f3L8PeQiw4w7F58Y5ye2GpTVGqjALrR7o95RYgW3zj3/84969e9xENTnnvp9yEFoWnEShBBLLvSdPnqysrGBjidKSlK3pqUEcyYPS5L10M0QgoLFZaZ67N+A1vYGRS9xcRBfLxk/u3CGqbdqEu/CcfHIby8ySUrNYrOcLHGvTIfiXL1+S6wijlUHrgVYNZQXJGA9l8xW80WJ8kP31ZsGZ88Fr+wVSSNjvDnfXjZs3bt28hUcCnems0K0fRKDKIMmRiDXsRNDRlXVZT3W6HaQUsopqBf1MMM45YrlE85GRUgDgmXPy17NKY1+Wjz/+eGlxod/tYPUkV5nMnqOqwiSHAMSBvKz+EFQoXQb4F3zi1dtYlSk1AQkV0j/a9xXXEne/D27fIlPC6iIFH2HV8TzvZgaBFIHZ3Ny+//AhsgpTLlF14qmT4SKSp2ljc4OUzPk5KjvazpWpYuUYq0I5zSSoyHJ5+PDh/fv3GfMXxSc4V0wyMkarx1SpABm++eYbLCJ+iH5MCdBvwr35AxehxSALwO+++44/VLoSpO2Kz8OKLyPRAMgxCZlIH2e1+OzZcziQ6mLe9Mg77eeZ/opsMZ2KXf/o4SOSqVkdQE+50SQbxbBzggwRw0enE1v2UfNy796PEEMeeRUXKaCcSGYq8pQtleq70XTyquN+NVBWA29Ftqkygq+d8Q1znmz6zz77jNVi8qLDH45imyGWUgqeihrwW2CkowExrUS4Xt8j2tRI4DwjA1JVJvdkgU6EW19++SXcgjloRtRa0mYulSaLdKwtOYnUFwSdDKnAP5OvKiNDic5d50pSbeDWt99+S4YwlBKLkjmv9aSJZWhAuAWlkFXoRxILRUC50TMyvA8cCR1rB2v4hL0ltkAeOJec6krdGqSeJ3jVWQNyVNxR51khZGSoQ4JTRoJogzWFioNFqVUOg/I//+v3iDX4Aw0h0cuXq6wkeVlWFbVDwYrSaq+U1YwMc0XMLYczMIRBTDsoMLGWlpZpJYGpVZW1WbDVn9axq7DWEWV0S/jr//wVlQnpQmJo6jKbkZGiwzpK0YEQvvrtb+98+imasVVXZRHKr//4J0hXGLCnT58DTjPn3t07NSPDLO1fjQCjaBELCq+nQ9H94b//hLKUdwvHFfkwjItjIiM76LHf8T7ALR984YMLQQLNYbBTVnrcXMGMDNVcQCykEkZ9VVZqPy816WNxaTflbR0RGRlpGzMK39kXiAEMcpygYA61y9DtmHHAjAxLrUdodbazs60uI04OdzU9UwT6OJ08MzKCZJNyXhBPsdLalb//wx+ZojaQqeNSKiNDBjpgoKLAK1cut6raqQaVBC6O79N4OCMX9cMqiMQS0IlG6ip7gmzjjAyLSMtDuETClffeMYGjgdfQLfXAzMg4wQY2gCFZxxhbJZ53YjhUCxKpVnT6pNowI7tJVdhjtAy0tdebFFNTLy9iyadVnBgZuX1S4f/j3/79/wMoJ9yWdfnH9AAAAABJRU5ErkJggg==";
                    }
                }

                foreach (var experto in expertos)
                {
                    experto.Contacto = contactoslista.Where(e => e.ContactoId == experto.ContactoId).FirstOrDefault();
                                       
                    //SI EL EXPERTO ES INTERNO AGREGAMOS SU INFORMACION 
                    if (experto.TipoExperto == 1) {

                        var datosPersona = await p.GetByClave(experto.ClavePersona);
                        if (datosPersona != null)
                        {
                            experto.Adjunto64 =  await p.ObtenerFotobyclavepersona(experto.ClavePersona);
                            experto.NombreCompleto = datosPersona.NombreCompleto;
                        }
                        else {

                            experto.Adjunto64 = "";
                            experto.NombreCompleto = "";
                        }
                    }
                }
                return expertos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task<IEnumerable<Experto>> GetExpertosInactivosByComunidad(int id)
        {
            try
            {
                //Obtener expertos con su linea de desarrollo 
                var expertos = await _cr.Expertos
                    .Include(e => e.LineaDesarrolloTecnologico)
                    .Where(e => e.ComunidadId == id && e.estado == false)
                    .AsNoTracking().ToListAsync();

                PersonasRepository p = new PersonasRepository(_gen);
                HashSet<int> contactoids = new HashSet<int>(expertos.Select(e => e.ContactoId));

                ContactosRepository contactos = new ContactosRepository(_cr);
                var contactoslista = await contactos.GetContactosCP(contactoids);
                foreach (var _contacto in contactoslista)
                {
                    try
                    {
                        var archivo = _contacto.Adjunto.RutaCompleta;

                        Byte[] bytes = File.ReadAllBytes(archivo);
                        String file = Convert.ToBase64String(bytes);
                        _contacto.Adjunto64 = file;
                    }
                    catch (Exception)
                    {
                        _contacto.Adjunto64 = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAdkklEQVR4XuzSIQ4AIBADQf7 / 1h5vIDkDDkWCmFEVlTvqARAWwkJYCAuEhbAQFggLYSEsEBbCQlggLIT1OYSFsBAWSarNdrvtZ1q1c7PaO / PeOI5r7fep7h5yuEikSG2OFltObOsfxy8Q3Avcz3VvnNx8wiA3SHxvEG / aF0qkbHFfZqt6f6gHLIxHAkRSVNgzrEdUs6bYJGa6nz7n1NmqKjKKwg7BOISgGeccY + 99iHARxRD0UybT7wJmOGYY5MrEqqqKY + LQMOHSQEg / 1SCRT5NpPiNLrMSGUVk1ItIGg0Gv15N80pH5fr + fuGgRRUYmliB + cBzWhmmQJBlkarfbIULzaVCWZWIV / OOYUX799dfF + YX4UYRoKlVVCeAKkol5F4kyQjgdhsFvVVUtkSaCCm + VXmZZYk0KghXG / 7ff0ajXOIGDIZl8t3Owv79 / cNDh2O12IUq30 + l0O71eP4qi4Bw0quqqciWDcmZmdnp6Kh6nmXfO6lYrCjmJOR9paMxbYQOmfIC9sJMTEvOSJs3EGiOJBCpXVwxlD0UDvKgiYFKncwBzdiI2Nja3trZ4WXCGcRgxx / kmmAbmDGkF4ZiYak3Nzc222zMXL16Ynm7PzMy029Nl1YrK0UNszoZvkMjKyvd7ECutGGSxMcirwvGBucLVQeaQDPNDo3tvb299fZ2PD5kYQzLZ5BxQiLwcMPN2rSbOBc0PW10ANVrV9fzc3KWI + fn5CxcumLmoJYM4VFqAR / 1BD84xI4ZxQibW + AgsV3Lvur1uq9VCWyGNoNFmBJTa3d2FEHVdW4QzC1GEIISOvsQTVyAWvwUd + WvpLzCGNAsLC9euXbty5QovoR1n1qUVHgxEWmlN2FyMDTKxrERiWWlhELa2t1ZXV1 + 9erWxsSEBI + HE0UcML / dEl6OwasRISn8kzYttCwuL165dXV5eRkUyFQY9sUrvYfIkVjXZBhasMecwnVYiUHkWgSCRj0DuTd1gDYBU4TuNHtFiEJF + N80nbiEsmfnpp1dra6uLi4s3bty4fvXyHJ6LIiDAWCJIsGV3wzhAd7d0LPDu33 / 4w48 / vHz5Ug4nBIM4NEyINBCO7kDXaRJ7AjMWwXiYahJL0GhjYx1lDJ1ZTgLpUP1WVoWNgFQMDIArSKAQIWEjAfDs2bMHDx9tbe / 1w8AK08myfkbWe5pJlDoBiUfYNuLEFxhbYb7wod + bbrWuX79269YtLDC4juhCsEkbioJ6n5lYZwAFWEQp3cKDgwMZ6RhSz58 / X1tb29nbc65VOBMRm + EuCqhJPA7Q7Pr165988gnckgkPsfRsnGXMMRMrqaFEMskknAgPHjxYfbnqg6 / qli / KUDTqJoXSChcCa1UmsLru3Llz9epVpKw0cnpOGGcb6wyAcNLVl5YpI8iI + vbbbxHDrakWX3DPe3k0mwMrguettlo1JtfO7i5efmbn5ub0KZJ6HWuh5YqxBWEWqY + 08nr8 + DGswpvA2JnzAzjX0IceqwrLiqj23OwsTv9Hjx69ePGCRasNuzDOBJlYxHwRU3zJaU4 + J7cHzycKkdUWiibqxzJYA1eszlUlxyRot3d27t +/ j / N2cOZ8yn4sV1aFlT7066n2xub2dz / c29jaiUaV9QaBo1k5CNAqNNBvG8yK + D5D4L / Vrand / c4P9x64qsZHH7y09yAb72dgqHjvvBlKEA2Ctf7kyRPUIuIq + KBAnnyk1lTnrQ29Oam / fq9 / +fLlu3e / WLx0aW93p7KzSLPJqjCFZfBXoQQZy / VQWMp7YthQmP5rbIbWZklYt + qVFytPnz1TxkS2sc6GVWVV4rLCpf706VOiy1objulnMbPkacOK51Fp1a2z + ThZYpk5 + PTw0cPt7W3yn8Y6OyAFLkmz2d / bRwDv7u2dicDNxDKk1pMnTzfWN4gnp2jMBJR1uNLxqDx69DDNZGJ9QKRUFgbKNCcN5uWLFxjsZANLm4w1n5KxpfDiixcvyRzDapRC / FDBqEwsM0vEkpH +/ PkKrkXZJSqCmKQqNJzy2I5Y8You8AEzsT4IUla4As84QslwOugcWITSYCanWNQMfhFKlzMoRQ9zrPD0MZzqxMTTZ09fvlhjdigXYNLQ63TqusJfqlygDyuVcxDauWjbPn500OlNTU2Hw1KqCcsZd85KMyzIpaWl2dlZNOPpP0JZFSqBOCkFldaYFWIVEKsYTBa3SoIKJJZh0RP9hGT6gJlYH4ph66 / XeYL9wBNolrgSqyZJIcaEHxBWV9eoJiJU9YYR6XOs8NSMd + ccV / nPf / 5zp9t1Za1Y7aSiCqZa6q / +32 / JYybNJhpbA1inQHYRLIoGyxLrveAiSLeK + eBwys5BDxzjC73PR5aTpRBMR16GrApPId7svSdHVEUHk84rKBOk5V +/ Xid49aFWhVlimVnssLChMRd + smGFSSqzCqavxOmzKhNLD67Wg3p2GYdJZ5YrnfyilLXSGFUVkSFkYn2AQkIc7goawqnzILEktaKZtQ2xTj + qk20sM6NskCWhGDbQVZ5ghKLX7zFQpeHOzvbu7k5ZVkxkYp3ykrAToYlkyU4sLI1M0pp2cB + k6CgHoRFXCC0GkViVD36yPQ5WDJcWGhILF7yZy8Q6NahvB0vCZGcYhwkXWAaCT3lmYXNzi2LEU14OZ2LxsPLI / sLqcloYTjKz / JDui89Vz53up86qsAu6vWi9WoyjBWdusk0ss + FGqAVmgPdePyk0HeL4RMhpM9DIMNUPDrqPHj4xc8TKqqqFrA3AikmGj9wCgW / mB / 7CxYtk0aAQnSuZMTt5WmmWWKZjv + epvXNWhcCUMysZTHq / Zxefn / SAGZ3CeWnm + OJHFpFL7E8I5bmjCJSApSAaOIc7SWENqCFbCP50aniyg3Rvfy + VsvBdFc / nDfv7e4PBeAR23LhIrL1diJWIJl7Z + SPWvjwOugRC8T7IEgstIELJ / jhvqlCmVLfTjdGtLLHeO51BR8DDGiIYx2NxrgCT5NbC1lRaKS8zsU6836mlejokVjTah5kHzh29Oh15s4JzmVjHhCyH4bWPcpGVQ5Iu8fmEtt + RlxhkP9ZxEVKbBgax0eiozXG + IA5FW9PMvVcTlGy8 / 5JYaoJ3CEbnD9ol5eRKMKtCySTvg0VoE0rx6TyDC5MyZ07oa8jGO + xyzlKRKi / zTt5pe54TBnMysUQmbYIKmMniCpSuBDHr38pYapEdpCfByEXL6A / 6aoOrdgIWkYmV8b6Zf / 0 + pOp7709vf / JMrAzjEHwQ3qO4PhNr1B1qxblG0GbpKQ3r / Qys7MeSzM8mVyiCixCvGo6q4S1AzDh6rYAKYOd6bahNneQrVsbfsVuxZWKlF4O4d9ypOdwzctqMltQ8o3VVv2 + IMCMTK6XKeB + 0k2p7pm0jJarvybCMvCrU1vNpMuPkcfgchMbFHJVgxQQ5k3Qe88EzE9I15SReTTTiBwxvUsmc4 + vYZkFubmtmPm4NUFU1jSEfPXz0ev016d6j / LNi4qFnJy2HvR / MzM5iG9y8efOj69e4QoN + x5llYh3VEejKFhY7bdbYKZn9 + xSHzspPHec6Bwdsef / FF1 / cvHmj3 + lY4bMqPAKsUCcMH8LKygpbQtITq65ry8RSL3vvkVj0UWbL / s2tLXM5CH10eRUHO9vb7FLk43WUZytDixgzY + PPn3 / 6efXlS / Xozg7SI0E53XRHpnFPu91WD6PMLYDkds6xmmHPYhpJbu / sWJEl1nHKKFTvJYe7jprMEgvALa4JQgsjgd1A4z5CIRPrnTBtX6sK1X5MQRKrMtKun6lHSL / XN5WCZWIdaUeGwrqov4iUgJuR9piV0JL0ClkVHj1VUs + lWCUVkLmVdqoCYpgnRzl4y9kNR4cPXi6GkcrMLLGQUhro6CxLrGMgBB / a09NaSwNdx4SMEDHdbscd / I / qPc6xQr4CjobkpEkO0gwzS9vJzrTbU1Ot7Mc6RtFA6RzXrFVV / W7PQamBV0BW5GLIwNvkF0 + o9TYDgZeOGe8HoVf4MNOarlyJV + aoAitnkLrC5tqzM9Ptve3dOm6HPCxdTcdJj0M7P5p4Zj6YYWb1sbSmW1OzMzNHTU3OqtCsUP8 + ttdeXFiU9Y5OtDdSG + xcmlbODMPACrswP3 / hwoWcj3UMA0tlFIwvX74MvfYPDt40IyycXx8pgGGwam5 + PhPr6AguAqHFtYNbsOpN5 / v55FXqajE7O7uwsFAfJwKdbSxL / gUz + 9WvfkVsh4D0WzTmuSSWvKMfffTR8vJlTC1emmWJdQxpH1hUM1hcXLx27RpWRXIMpqd2uJhHx8mjkXKwNVYYhyOy6vr16 + T6eQUkCst76RwR5gcByGcjbxZyS9ExzRz2uTU5o2WWcfKk5SVbwUMlY8B7zxHb4LPPPltYuMjLw5NCllhHDVxgs6tDJHTB0vrNb37z + eefI73gELkiHAO0Us1FXDNCKbg1YQtAZaF1ImRl / vrXv / 7000 + RVXx8ZqBdzsc6BpQtI8ZArNgcsfj449tfffXVl19 + iRYgpxQazczOQCidP4EJWyHwMefn53nGLl68eOfOnd / 97ncQa3l5mRkZA37gc5XOsWDBuwhDA + hh1WtlOkA1VOHq2tqPD + 5DQV5CwYnKrjHz / f7SxcW7d +/ y0dCGkIysUXJHJdG5KpFVwcriiM0O86owmDnMKOiCCegiZLzjgIA6aEmuMtYWKZRuaAOLSSIWXNEnxaKKObQ8S12KK5mUxSl6heCPTqlMLOPgQ98HX7vKzLAwur0OJntdV650yH / EGK / MOeglAx + k1iuTgWhF9fmureQKs9ZUi1kz8xwLoeQs6JWJdSToSqHcPKHWYK7UTjLR3zywAOIEJrvyAbn00C4 + wWF8LS0XodWfmZVVGXdR9eZCaYJH / zEVQBJthc9b955YMybDXO4rdaFhBR6er6woudQ54zjWda0hIjGMZ + jS4sK1a1ehWoo1vCGSc0e / D7ArGKqBf4ir5OkpxhnDXl9xjOSFkQ8 + RnDjexvqqp6bn1OIg5mx1oMjliJL3dI50hdkFfwrXSqZWIU5I68m1VxAr7EWV8OpoYzbMzM4sbwPYeicLLH + BQj8Q2LJiZruyphCPuFUkoRyx73ebk8HLVTGDnKQjimtzNX7ne5f / vIXHDzcCfxekxEr5FPArbt3P79z6zbO4NzR7wyAC5FQ / 7gbWMDMpAR1RGLJwDobcZWJxQ3AN40jHvUBycbdxhJY5166dGmeSPMZ7HiWiRXdhWhEJBaxnRDhvR93Yin0ztNCP98zsNYzsSxWS5M2Q2iWgD9CCxtrrFWhAJlQ7kisM7Las8QKRelKmSNXrlxhAZUcWuPXsTvWjxgorNfrwyqWhL1OZ6wz + 6txXj2FAnXYLxbmZxYvXtjZ2nBwKTgfyDKtUCODfp / A9aCRMVoLv + R9zA8NPsxOTy0vLlSu8Gf3ZGQ / li + d73V3S1d8dO3KbLs96HVbtZVWuMAXyjKUzjWSVTGyHOzwK94GmNXvfXT96vLSou / 3xj0fduy91TEZsL8cIW1YVTX3SKlLTe0GbyMfpKwq5xz2IvmxNK1QVCcT6wyL7AptMlBV5fWPrmOakLylwhVgzpQY3jyEkQ9CYz7e6tWrVzGwGGgyE + ssM7dk9u7vHxA3pAhRpSxqUm38C2EsnhAtb9kWwDm3t7d3hqHPTCwlWBop71H9lQA9QkkP3KrKiiO8QhsWzVaFcjHw9qlBpQyJVWHKzcrEOht4H2KDI6Wb1ggqWEV1q5n1ItsavA + duhOZkmT0zhG32vWTh + GsiJWD0ED9snwcaoNk45agR7755v / WVl / Nzc1j / w6CL5yFxqkJZ6jrspDiwwlH1eTtj2 / GQreGZRvnXezNTN3Pb9++TToNldNM1s1ThQgrB6liwr5quJGyy5eX0ewNNdgzsbhPCK2lpSX6l8qd7UNo8t7ECm5iWtHsSpOZWA2F3D8UeFZ1JRlWWOOajfvgh3ucEJXyjaVVJpaaH3G0WIIno9gaGzUIISW + EkHnBZOZWE1asQeXxmUEiVnT01P9QZcqPCYaeMMsbo + qxnx1XfFuXWmJdIdfZ4MchAZO68GRNopolqkpDoRJXB + NY65pq1kHrSzge0OmtqamGXuPBvfKBuLl4VLXZYnVlKBbOpod3qTQwL4MeleqavZ8jYorjuazKmxWi07gIwIzDY0UKoIuY8sz8aaKz6qwoSXFHJv8DjmYGd + 8b76TPRNLQkvwzSaWyKRnoOElRlkVCoe88s1NPgmSUpaGTUcmlu7S7u5u3MzCmtkpxJWl2qaxdu12O3hxsyocD + c7pXmxNKHhS1n1bQ + xvihkidX0emLuk2RA8KG5ayyz5HwnXu59k82sLLEisQ46HSSWfERxsrldRkPhzWx3dweGNbg9X5ZY8dg5gFodXoQiWCO3RgkSrspVdBBrL4quBjfpy6oQEMZBFQ55txv5AJjJ2 + Bi995D5agfxochWC5Y / RDwRyn5DOYsJNVS9H3hXLG5tROstLIOPpiVvnkFq33vCRTyEa0sB6HodPvbu3sXLy6UtWMZqxR47wdFGLxLkRtfmVjHYhW0Ce + 4pqEKhQv2C0XYH / jNbYjlzEGpgQjXNMD1UJQcHQTyHn / D5vbuwqVlBXoC31yl / r3vjhgGd3S1k1WhHa8wL5V9liV2O6tCBQr5amb / GeWNqQyE98wbZmFoZj28bpphVWt2lEqQLLGOBXsHvUIM3bzNxqK7n / YFUZxE6 / kGEmsko3prawu7MHhvzultow3jwpbDOx6vTKxj4R2rOWgj5o3cofX19Yb3jBzZowUw2ImgkttLxGo + GfLvRN5A4DjNpZUaOvyV + GSReBrY8O6jjx8 / 5g4RKmGsjPJmEmvkpbb8pAxEMQNFOy0tbDnFHEddNjB8cZrZr7s6k04eBPI0Ft7mNXA + gh9CD3D4iyVH2b / mal + Y9ghRCxB2 + EWnwKdx6d8XIrSLJ + 8cv4NIFhPhq9oYx / 5G8SAjcqROOm1mkVp5D9MrHIKZyVeFEiQQIm1KaBFiTNpKtDwE06IX / OFXMKH29 / cOOt2Dg95BT + iJWJubm9wbBqlLbMN3NxkGshZu0WoGekEUqlhd8HVVMsPW4hypuRCHgDgExB5dzNTxgbEu8jmqhNaH17XQIwiGUvN0AqgYME14hlrhuN / 4OqRhgF9djOz2Bj0vcRX0yHIc91bv0uC6IC1X8KFqAKfqmnl2xGy3Z / jHbijUjCCkoyRDwlWimuilS5oeY5FvwoklsZz29hDDpBylEfqEkAeew9bW9uvXr9Fu + 3t7ONMlsTjBtFdvXQ04janhjY0ixjdmIFroUgRA1kNMiU + AXgaiPKNfN5Jsbo7a7zaAZ9qNXGTyEcM23IQTC0ppZ0c4JnGdrinSaAs2bfO1u7W5wzlJVwKNzZwEvFIwvZyNDCciOVHKTvt9ViDYm43gJemBM / 6xU1XFxqAw7GIEu6Qg4Ea2BdX5k2pjQQNLG8VUpSurKjKsB5fWkUybm8gntF4MkjnopEpOWV2yap1ZKLzkFjWDVV0bfyg4EWtidsGUInMxVQtSjBCrijuCHhqpPUQ7qYI4WV68eDETweoytpGup6fbWiRBRi / 7fUwlVlDNnFlS6nFoaUYGhJQal + P16 / XV1VUuCs + oTjg821ncBFJ / ExKpwVpyACmy3I9p7SOLoHHfBTNVsIG6rFwhaiV6JYMpnQj7BmleR / iE9LoUwYCCWMS / j9DejrqYeim9EUuxPfxtHrHMzNUYQ1ABeXToIEDeeGlAcwZFeMS2d7Zfra29evXT3t5uSnDjOCLcRiDOiFLptImHvV1vjmSgpdc2pPgCNMXsX15eunz5CgzDCItaMijcJaOCEczU + Y5JJhpILFdOdemyp66yRYGkTus1npftra3Nra0XKytEXeL6ZQCXUIh2qlosI4BoSWiZqU5JNHZjtwt6nGKEcXfMuV63Oywmq7pyMM73G0csqIF5zWJN75UZGUm4nTaj / fRThIzxJKJOXYVlmJkuKAQqnfORXigKOITEgmE01GTLBex9LFdYxT1yrqROwLx3kn9NlFj9XqIOduXr1z + DV69eUTaTzFIw7NM6Xbs7Q0aIfKTyFYs9muQExrgnbty4QQQJAaZ1qA++NnPWSFVYuDpE9kAUhNPz58 / X1ta6XagW5L3UFo + M5QnMgurDeS6SxziJK2wsXXmgExBaKEcEGMHvUAQ0jhX + jIPQKdr1C2JZiaxilffPf / 7z++ +/ x7epgAxIC8OR + vdTrwPOgD0pFJvauwEGiVWco + ogTBTu16A / wBmGbf8vNd4hgZIFYDoDxfKSb3PYYNzeOXi28hxgV + mJedN + Si8zmT5o6sSIyfHmpG6ltkxrt / F / Td++cePK5SV8E2YO / qVMJLkeh2OUp0YsaWjlOclNAsPgO9YfApafwvpnKyurqz / v7O3CPHrhKzGyscZTRgqpmYJIpYNES5cWaA2Mi1U6VNJhxGhhfGo2lvguKSUuC7AKuw8n55Mnj39eXzerw5AMGysdl4VccMEHhEJ7 + kaEtvQZpqDGp5nznkgqo09jpalgS33zzf + urq6h2eF3iqWrZ2smFmh + 6o7sHG4fqgY98 + OPP / 7tb39j4ZVW7ikf7jSJJd0nlSxtiKZj / tmzZ3//+98f3L8PeQiw4w7F58Y5ye2GpTVGqjALrR7o95RYgW3zj3/84969e9xENTnnvp9yEFoWnEShBBLLvSdPnqysrGBjidKSlK3pqUEcyYPS5L10M0QgoLFZaZ67N+A1vYGRS9xcRBfLxk/u3CGqbdqEu/CcfHIby8ySUrNYrOcLHGvTIfiXL1+S6wijlUHrgVYNZQXJGA9l8xW80WJ8kP31ZsGZ88Fr+wVSSNjvDnfXjZs3bt28hUcCnems0K0fRKDKIMmRiDXsRNDRlXVZT3W6HaQUsopqBf1MMM45YrlE85GRUgDgmXPy17NKY1+Wjz/+eGlxod/tYPUkV5nMnqOqwiSHAMSBvKz+EFQoXQb4F3zi1dtYlSk1AQkV0j/a9xXXEne/D27fIlPC6iIFH2HV8TzvZgaBFIHZ3Ny+//AhsgpTLlF14qmT4SKSp2ljc4OUzPk5KjvazpWpYuUYq0I5zSSoyHJ5+PDh/fv3GfMXxSc4V0wyMkarx1SpABm++eYbLCJ+iH5MCdBvwr35AxehxSALwO+++44/VLoSpO2Kz8OKLyPRAMgxCZlIH2e1+OzZcziQ6mLe9Mg77eeZ/opsMZ2KXf/o4SOSqVkdQE+50SQbxbBzggwRw0enE1v2UfNy796PEEMeeRUXKaCcSGYq8pQtleq70XTyquN+NVBWA29Ftqkygq+d8Q1znmz6zz77jNVi8qLDH45imyGWUgqeihrwW2CkowExrUS4Xt8j2tRI4DwjA1JVJvdkgU6EW19++SXcgjloRtRa0mYulSaLdKwtOYnUFwSdDKnAP5OvKiNDic5d50pSbeDWt99+S4YwlBKLkjmv9aSJZWhAuAWlkFXoRxILRUC50TMyvA8cCR1rB2v4hL0ltkAeOJec6krdGqSeJ3jVWQNyVNxR51khZGSoQ4JTRoJogzWFioNFqVUOg/I//+v3iDX4Aw0h0cuXq6wkeVlWFbVDwYrSaq+U1YwMc0XMLYczMIRBTDsoMLGWlpZpJYGpVZW1WbDVn9axq7DWEWV0S/jr//wVlQnpQmJo6jKbkZGiwzpK0YEQvvrtb+98+imasVVXZRHKr//4J0hXGLCnT58DTjPn3t07NSPDLO1fjQCjaBELCq+nQ9H94b//hLKUdwvHFfkwjItjIiM76LHf8T7ALR984YMLQQLNYbBTVnrcXMGMDNVcQCykEkZ9VVZqPy816WNxaTflbR0RGRlpGzMK39kXiAEMcpygYA61y9DtmHHAjAxLrUdodbazs60uI04OdzU9UwT6OJ08MzKCZJNyXhBPsdLalb//wx+ZojaQqeNSKiNDBjpgoKLAK1cut6raqQaVBC6O79N4OCMX9cMqiMQS0IlG6ip7gmzjjAyLSMtDuETClffeMYGjgdfQLfXAzMg4wQY2gCFZxxhbJZ53YjhUCxKpVnT6pNowI7tJVdhjtAy0tdebFFNTLy9iyadVnBgZuX1S4f/j3/79/wMoJ9yWdfnH9AAAAABJRU5ErkJggg==";
                    }
                }

                foreach (var experto in expertos)
                {
                    experto.Contacto = contactoslista.Where(e => e.ContactoId == experto.ContactoId).FirstOrDefault();

                    //SI EL EXPERTO ES INTERNO AGREGAMOS SU INFORMACION 
                    if (experto.TipoExperto == 1)
                    {

                        var datosPersona = await p.GetByClave(experto.ClavePersona);
                        if (datosPersona != null)
                        {
                            experto.Adjunto64 = await p.ObtenerFotobyclavepersona(experto.ClavePersona);
                            experto.NombreCompleto = datosPersona.NombreCompleto;
                        }
                        else
                        {

                            experto.Adjunto64 = "";
                            experto.NombreCompleto = "";
                        }
                    }
                }
                return expertos;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener listado de expertos por comunidad
        /// </summary>
        /// <returns></returns>
        public async Task<object> expertosEnComunidad(int id)
        {
            try
            {
                //Obtener expertos con su linea de desarrollo 
                var expertos = await _cr.Expertos.Where(e => e.ComunidadId == id).AsNoTracking().ToListAsync();               
                return expertos.Count;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener listado de paises que tienen relacion con expertos externos
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetPaisesRelacionExpertos()
        {
            try
            {
                //Fks de contactos en expertos externos 
                var listaFKExpertos = await _cr.Expertos.Where(e => e.TipoExperto == 2).AsNoTracking().Select(e => e.ContactoId).ToListAsync();
                //Fks de paises relacionados a los contactos
                var listaFKPaises = await _cr.Contacto.Where(e => listaFKExpertos.Contains(e.ContactoId) && e.PaisOrigenId!=null)
                    .AsNoTracking()
                    .Select(e=>e.PaisOrigenId)
                    .ToListAsync();

                //Obtenemos una lista de paises 
                var resultados = await _ctxCH.Paises.Where(e => listaFKPaises.Contains(e.PaisID))
                    .Select(e=> new {
                        PaisId=e.PaisID,
                        NombrePais=e.Descripcion
                    })
                    .AsNoTracking().ToListAsync();

                return resultados;

            }
            catch(Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener listado de empresas que tienen relacion con expertos externos
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetEmpresasRelacionExpertos()
        {
            try
            {
                //Fks de contactos en expertos externos 
                var listaFKExpertos = await _cr.Expertos.Where(e => e.TipoExperto == 2).AsNoTracking().Select(e => e.ContactoId).ToListAsync();
                //Fks de empresas relacionadas a los contactos
                var listaFKEmpresas = await _cr.Contacto.Where(e => listaFKExpertos.Contains(e.ContactoId))
                    .AsNoTracking()
                    .Select(e => e.EmpresaId)
                    .ToListAsync();

                //Obtenemos una lista de empresas
                var resultados = await _cr.Empresa.Where(e => listaFKEmpresas.Contains(e.EmpresaId))
                    .Select(e => new {
                        EmpresaId = e.EmpresaId,
                        NombreEmpresa = e.NombreEmpresa
                    })
                    .AsNoTracking().ToListAsync();

                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener listado de comunidades que tienen relacion con expertos externos
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetComunidadesRelacionExpertos()
        {
            try
            {
                //Fks de comunidades relacionadas con expertos externos 
                var listaFKComunidades = await _cr.Expertos.Where(e => e.TipoExperto == 2 && e.ComunidadId!=null)
                                                        .AsNoTracking()
                                                        .Select(e => e.ComunidadId).ToListAsync();
                CP_Context ctxCP = new CP_Context();
                var resultados = await ctxCP.DbSetComunidades.Where(e => listaFKComunidades.Contains(e.ComunidadId))
                                                        .Select(e => new
                                                        {
                                                            idComunidad = e.ComunidadId,
                                                            NombreComunidad = e.Descripcion
                                                        }).AsNoTracking().ToListAsync();

                

                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener listado de comunidades que tienen relacion con expertos externos
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetLineasRelacionExpertos()
        {
            try
            {
                //Fks de comunidades relacionadas con expertos externos 
                var listaFKLineas = await _cr.Expertos.Where(e => e.TipoExperto == 2 && e.LineaDesarrolloTecnologicoId != null)
                                                        .AsNoTracking()
                                                        .Select(e => e.LineaDesarrolloTecnologicoId).ToListAsync();
                var resultados = await _cr.LineaDesarrolloTecnologico.Where(e => listaFKLineas.Contains(e.LineaDesarrolloTecnologicoId))
                                                        .Select(e => new
                                                        {
                                                            idLinea = e.LineaDesarrolloTecnologicoId,
                                                            NombreLinea = e.NomLinDesTec
                                                        }).AsNoTracking().ToListAsync();



                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Obtener todos los expertos por parametros
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<Object>> GetConsultaParametrizadaExpertos(Experto parametros)
        {
            try
            {
                var expertos = (from ex in _cr.Expertos.Include(e => e.Comunidad).Include(e=>e.LineaDesarrolloTecnologico) where ex.TipoExperto==2
                              select ex).AsNoTracking();

                ///Si la coleccion esta vacia retornaremos null
                if (expertos != null)
                {

                    if (!String.IsNullOrEmpty(parametros.NombreCompleto))  //Busqueda por experto
                    {
                        var lista = await GetContactosLikeNombreLatin1(parametros.NombreCompleto);
                        expertos = expertos.Where(e => lista.Contains(e.ContactoId));
                    }

                    if (parametros.LineaDesarrolloTecnologicoId != 0)  //Busqueda por linea de investigacion
                    {
                        expertos = expertos.Where(e => e.LineaDesarrolloTecnologicoId == parametros.LineaDesarrolloTecnologicoId);
                    }

                    if (parametros.ComunidadId != 0 && parametros.ComunidadId != null)  //Busqueda por comunidad
                    {
                        expertos = expertos.Where(e => e.ComunidadId == parametros.ComunidadId);
                    }

                    var listaFksContactos = expertos.Select(e => e.ContactoId).ToList();  //obtenemos los ids de los contactos resultantes al momento en la busqueda
                    var listaNombresContactos =  await (from contacto in _cr.Contacto  //obtenemos una lista de contactos a partir de los ids recopilados anteriormente
                                                       where listaFksContactos.Contains(contacto.ContactoId)
                                                       select new
                                                       {
                                                           nombreCompleto = contacto.NombreContacto + " " + contacto.ApellidoPaterno + " " + contacto.ApellidoMaterno,
                                                           ContactoId = contacto.ContactoId,
                                                           PaisOrigenId=contacto.PaisOrigenId,
                                                           EmpresaId=contacto.EmpresaId
                                                       }).AsNoTracking().ToListAsync();

                    if(parametros.EmpresaId!=0)  //Con la nueva lista comparamos los registros que contengan la empresa buscada
                    {
                        var listaIds= listaNombresContactos.Where(e => e.EmpresaId == parametros.EmpresaId).Select(e => e.ContactoId).ToList();
                        expertos = expertos.Where(g=> listaIds.Contains(g.ContactoId));
                    }
                    if (parametros.PaisId != 0)//Con la nueva lista comparamos los registros que contengan el pais buscado
                    {
                        var listaIds = listaNombresContactos.Where(e => e.PaisOrigenId == parametros.PaisId).Select(e => e.ContactoId).ToList();
                        expertos = expertos.Where(g =>listaIds.Contains(g.ContactoId));
                    }
                    //******Se inicia el proceso de proyeccion******
                    //Los resultados lo guardaremos en una lista de X objeto
                    List<BusquedaParamsCR> datos = expertos.Select(x => new BusquedaParamsCR //Es una clase no mapeada que contiene caracteristicas 
                                                                                           //que nos permiten albergar SOLO los datos necesarios
                    {
                        ExpertoId = x.ExpertoId, //Rescatamos los parametros que se requieren para el front
                        ContactoId=x.ContactoId,
                        LineaInvestigacion =x.LineaDesarrolloTecnologico.NomLinDesTec,
                        NombreComunidad = x.Comunidad.Descripcion,
                        Especialidad = x.Especialidad,
                    }).ToList();


                    //SIGCOCHContext _ctxCH = new SIGCOCHContext();
                    foreach (var c in datos)
                    {

                        //Asignamos el nombre del experto de la lista de contactos previamente creada
                        c.NombreExperto = listaNombresContactos.Where(e => e.ContactoId == c.ContactoId).Select(e=>e.nombreCompleto).FirstOrDefault();


                        //Obtenemos el nombre del pais del experto, en caso de que no exista la propiedad queda como null 
                        var p = listaNombresContactos.Where(f => f.ContactoId == c.ContactoId).Select(f => f.PaisOrigenId).FirstOrDefault();
                        if (p != null)
                        {
                            c.NombrePais = _ctxCH.Paises.Where(g => g.PaisID == p).AsNoTracking().Select(g => g.Descripcion).FirstOrDefault();
                        }

                        //Obtenemos el nombre de la empresa a la que pertenece el experto, en caso de que no exista la propiedad queda como null 
                        var emp = listaNombresContactos.Where(h => h.ContactoId == c.ContactoId).Select(h => h.EmpresaId).FirstOrDefault();
                        if (emp >0)
                        {
                            c.NombreEmpresa = _cr.Empresa.Where(e => e.EmpresaId == emp).AsNoTracking().Select(e => e.NombreEmpresa).FirstOrDefault();
                        }

                    }

                    return datos; //retornamos los datos, y al hacer esto ya no pasamos por el siguiente return (el de abajo)
                }

                return null; //por default, en caso de que no tengamos datos desde el inicio retornamos null

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        /// <summary>
        /// Obtener las claves de los expertos que coincidan con la busqueda
        /// </summary>
        /// <returns></returns>
        public async Task<List<int>> GetContactosLikeNombreLatin1(String likeNombre)
        {
            try
            {
                var resultados = await _cr.Database.SqlQuery<int>
                ("SELECT ContactoId FROM CR.cat_Contactos where NombreContacto collate Latin1_General_CI_AI LIKE '%" + likeNombre + "%' " +
                "or ApellidoPaterno collate Latin1_General_CI_AI LIKE '%" + likeNombre + "%'" +
                "or ApellidoMaterno collate Latin1_General_CI_AI LIKE '%" +likeNombre + "%'").ToListAsync();
                return resultados;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        /// <summary>
        /// Obtiene un experto por su id
        /// </summary>
        /// <param name="id">ExpertoId</param>
        /// <returns></returns>
        public async Task<Experto> GetById(int id)
        {
            try
            {
                //Obtener expertos con su linea de desarrollo 
                var experto = await _cr.Expertos
                    .Where(e => e.ExpertoId == id)
                    .Include(e => e.Comunidad)
                    .Include(e => e.LineaDesarrolloTecnologico).AsNoTracking().FirstOrDefaultAsync();

                //Obtener los investigadores con los que interactuan
                PersonasRepository p = new PersonasRepository(_gen);

                var investigadores = await _cr.InvestigadorPorExperto.AsNoTracking().Where(e => e.ContactoId == experto.ContactoId).Select(e => e.ClavePersona).ToListAsync();
                List<String> claves = new List<String>();
                claves = investigadores;
                var ListaInvestigadores = await p.GetAllCollectionWithoutStatus(claves);

                //Obtener la informacion de los expertos del catalogo de contactos 
                HashSet<int> contactoids = new HashSet<int>();
                contactoids.Add(experto.ContactoId);
                ContactosRepository contactos = new ContactosRepository(_cr);
                var contacto = await contactos.GetContactos(contactoids);

                experto.Contacto = contacto.FirstOrDefault();
                experto.Investigadores = ListaInvestigadores;
                experto.Contacto.PaisOrigen = await _gen.dbSetPais.Where(e => e.PaisId == experto.Contacto.PaisOrigenId).FirstOrDefaultAsync();
                if (experto.Contacto.Adjunto != null && experto.Contacto.Adjunto.RutaCompleta != string.Empty)
                {
                    var archivo = experto.Contacto.Adjunto.RutaCompleta;
                    if (archivo != string.Empty)
                    {
                        try
                        {
                            Byte[] bytes = File.ReadAllBytes(archivo);
                            String file = Convert.ToBase64String(bytes);
                            experto.Contacto.Adjunto64 = file;
                        }
                        catch (Exception e)
                        {
                            experto.Contacto.Adjunto64 = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAdkklEQVR4XuzSIQ4AIBADQf7 / 1h5vIDkDDkWCmFEVlTvqARAWwkJYCAuEhbAQFggLYSEsEBbCQlggLIT1OYSFsBAWSarNdrvtZ1q1c7PaO / PeOI5r7fep7h5yuEikSG2OFltObOsfxy8Q3Avcz3VvnNx8wiA3SHxvEG / aF0qkbHFfZqt6f6gHLIxHAkRSVNgzrEdUs6bYJGa6nz7n1NmqKjKKwg7BOISgGeccY + 99iHARxRD0UybT7wJmOGYY5MrEqqqKY + LQMOHSQEg / 1SCRT5NpPiNLrMSGUVk1ItIGg0Gv15N80pH5fr + fuGgRRUYmliB + cBzWhmmQJBlkarfbIULzaVCWZWIV / OOYUX799dfF + YX4UYRoKlVVCeAKkol5F4kyQjgdhsFvVVUtkSaCCm + VXmZZYk0KghXG / 7ff0ajXOIGDIZl8t3Owv79 / cNDh2O12IUq30 + l0O71eP4qi4Bw0quqqciWDcmZmdnp6Kh6nmXfO6lYrCjmJOR9paMxbYQOmfIC9sJMTEvOSJs3EGiOJBCpXVwxlD0UDvKgiYFKncwBzdiI2Nja3trZ4WXCGcRgxx / kmmAbmDGkF4ZiYak3Nzc222zMXL16Ynm7PzMy029Nl1YrK0UNszoZvkMjKyvd7ECutGGSxMcirwvGBucLVQeaQDPNDo3tvb299fZ2PD5kYQzLZ5BxQiLwcMPN2rSbOBc0PW10ANVrV9fzc3KWI + fn5CxcumLmoJYM4VFqAR / 1BD84xI4ZxQibW + AgsV3Lvur1uq9VCWyGNoNFmBJTa3d2FEHVdW4QzC1GEIISOvsQTVyAWvwUd + WvpLzCGNAsLC9euXbty5QovoR1n1qUVHgxEWmlN2FyMDTKxrERiWWlhELa2t1ZXV1 + 9erWxsSEBI + HE0UcML / dEl6OwasRISn8kzYttCwuL165dXV5eRkUyFQY9sUrvYfIkVjXZBhasMecwnVYiUHkWgSCRj0DuTd1gDYBU4TuNHtFiEJF + N80nbiEsmfnpp1dra6uLi4s3bty4fvXyHJ6LIiDAWCJIsGV3wzhAd7d0LPDu33 / 4w48 / vHz5Ug4nBIM4NEyINBCO7kDXaRJ7AjMWwXiYahJL0GhjYx1lDJ1ZTgLpUP1WVoWNgFQMDIArSKAQIWEjAfDs2bMHDx9tbe / 1w8AK08myfkbWe5pJlDoBiUfYNuLEFxhbYb7wod + bbrWuX79269YtLDC4juhCsEkbioJ6n5lYZwAFWEQp3cKDgwMZ6RhSz58 / X1tb29nbc65VOBMRm + EuCqhJPA7Q7Pr165988gnckgkPsfRsnGXMMRMrqaFEMskknAgPHjxYfbnqg6 / qli / KUDTqJoXSChcCa1UmsLru3Llz9epVpKw0cnpOGGcb6wyAcNLVl5YpI8iI + vbbbxHDrakWX3DPe3k0mwMrguettlo1JtfO7i5efmbn5ub0KZJ6HWuh5YqxBWEWqY + 08nr8 + DGswpvA2JnzAzjX0IceqwrLiqj23OwsTv9Hjx69ePGCRasNuzDOBJlYxHwRU3zJaU4 + J7cHzycKkdUWiibqxzJYA1eszlUlxyRot3d27t +/ j / N2cOZ8yn4sV1aFlT7066n2xub2dz / c29jaiUaV9QaBo1k5CNAqNNBvG8yK + D5D4L / Vrand / c4P9x64qsZHH7y09yAb72dgqHjvvBlKEA2Ctf7kyRPUIuIq + KBAnnyk1lTnrQ29Oam / fq9 / +fLlu3e / WLx0aW93p7KzSLPJqjCFZfBXoQQZy / VQWMp7YthQmP5rbIbWZklYt + qVFytPnz1TxkS2sc6GVWVV4rLCpf706VOiy1objulnMbPkacOK51Fp1a2z + ThZYpk5 + PTw0cPt7W3yn8Y6OyAFLkmz2d / bRwDv7u2dicDNxDKk1pMnTzfWN4gnp2jMBJR1uNLxqDx69DDNZGJ9QKRUFgbKNCcN5uWLFxjsZANLm4w1n5KxpfDiixcvyRzDapRC / FDBqEwsM0vEkpH +/ PkKrkXZJSqCmKQqNJzy2I5Y8You8AEzsT4IUla4As84QslwOugcWITSYCanWNQMfhFKlzMoRQ9zrPD0MZzqxMTTZ09fvlhjdigXYNLQ63TqusJfqlygDyuVcxDauWjbPn500OlNTU2Hw1KqCcsZd85KMyzIpaWl2dlZNOPpP0JZFSqBOCkFldaYFWIVEKsYTBa3SoIKJJZh0RP9hGT6gJlYH4ph66 / XeYL9wBNolrgSqyZJIcaEHxBWV9eoJiJU9YYR6XOs8NSMd + ccV / nPf / 5zp9t1Za1Y7aSiCqZa6q / +32 / JYybNJhpbA1inQHYRLIoGyxLrveAiSLeK + eBwys5BDxzjC73PR5aTpRBMR16GrApPId7svSdHVEUHk84rKBOk5V +/ Xid49aFWhVlimVnssLChMRd + smGFSSqzCqavxOmzKhNLD67Wg3p2GYdJZ5YrnfyilLXSGFUVkSFkYn2AQkIc7goawqnzILEktaKZtQ2xTj + qk20sM6NskCWhGDbQVZ5ghKLX7zFQpeHOzvbu7k5ZVkxkYp3ykrAToYlkyU4sLI1M0pp2cB + k6CgHoRFXCC0GkViVD36yPQ5WDJcWGhILF7yZy8Q6NahvB0vCZGcYhwkXWAaCT3lmYXNzi2LEU14OZ2LxsPLI / sLqcloYTjKz / JDui89Vz53up86qsAu6vWi9WoyjBWdusk0ss + FGqAVmgPdePyk0HeL4RMhpM9DIMNUPDrqPHj4xc8TKqqqFrA3AikmGj9wCgW / mB / 7CxYtk0aAQnSuZMTt5WmmWWKZjv + epvXNWhcCUMysZTHq / Zxefn / SAGZ3CeWnm + OJHFpFL7E8I5bmjCJSApSAaOIc7SWENqCFbCP50aniyg3Rvfy + VsvBdFc / nDfv7e4PBeAR23LhIrL1diJWIJl7Z + SPWvjwOugRC8T7IEgstIELJ / jhvqlCmVLfTjdGtLLHeO51BR8DDGiIYx2NxrgCT5NbC1lRaKS8zsU6836mlejokVjTah5kHzh29Oh15s4JzmVjHhCyH4bWPcpGVQ5Iu8fmEtt + RlxhkP9ZxEVKbBgax0eiozXG + IA5FW9PMvVcTlGy8 / 5JYaoJ3CEbnD9ol5eRKMKtCySTvg0VoE0rx6TyDC5MyZ07oa8jGO + xyzlKRKi / zTt5pe54TBnMysUQmbYIKmMniCpSuBDHr38pYapEdpCfByEXL6A / 6aoOrdgIWkYmV8b6Zf / 0 + pOp7709vf / JMrAzjEHwQ3qO4PhNr1B1qxblG0GbpKQ3r / Qys7MeSzM8mVyiCixCvGo6q4S1AzDh6rYAKYOd6bahNneQrVsbfsVuxZWKlF4O4d9ypOdwzctqMltQ8o3VVv2 + IMCMTK6XKeB + 0k2p7pm0jJarvybCMvCrU1vNpMuPkcfgchMbFHJVgxQQ5k3Qe88EzE9I15SReTTTiBwxvUsmc4 + vYZkFubmtmPm4NUFU1jSEfPXz0ev016d6j / LNi4qFnJy2HvR / MzM5iG9y8efOj69e4QoN + x5llYh3VEejKFhY7bdbYKZn9 + xSHzspPHec6Bwdsef / FF1 / cvHmj3 + lY4bMqPAKsUCcMH8LKygpbQtITq65ry8RSL3vvkVj0UWbL / s2tLXM5CH10eRUHO9vb7FLk43WUZytDixgzY + PPn3 / 6efXlS / Xozg7SI0E53XRHpnFPu91WD6PMLYDkds6xmmHPYhpJbu / sWJEl1nHKKFTvJYe7jprMEgvALa4JQgsjgd1A4z5CIRPrnTBtX6sK1X5MQRKrMtKun6lHSL / XN5WCZWIdaUeGwrqov4iUgJuR9piV0JL0ClkVHj1VUs + lWCUVkLmVdqoCYpgnRzl4y9kNR4cPXi6GkcrMLLGQUhro6CxLrGMgBB / a09NaSwNdx4SMEDHdbscd / I / qPc6xQr4CjobkpEkO0gwzS9vJzrTbU1Ot7Mc6RtFA6RzXrFVV / W7PQamBV0BW5GLIwNvkF0 + o9TYDgZeOGe8HoVf4MNOarlyJV + aoAitnkLrC5tqzM9Ptve3dOm6HPCxdTcdJj0M7P5p4Zj6YYWb1sbSmW1OzMzNHTU3OqtCsUP8 + ttdeXFiU9Y5OtDdSG + xcmlbODMPACrswP3 / hwoWcj3UMA0tlFIwvX74MvfYPDt40IyycXx8pgGGwam5 + PhPr6AguAqHFtYNbsOpN5 / v55FXqajE7O7uwsFAfJwKdbSxL / gUz + 9WvfkVsh4D0WzTmuSSWvKMfffTR8vJlTC1emmWJdQxpH1hUM1hcXLx27RpWRXIMpqd2uJhHx8mjkXKwNVYYhyOy6vr16 + T6eQUkCst76RwR5gcByGcjbxZyS9ExzRz2uTU5o2WWcfKk5SVbwUMlY8B7zxHb4LPPPltYuMjLw5NCllhHDVxgs6tDJHTB0vrNb37z + eefI73gELkiHAO0Us1FXDNCKbg1YQtAZaF1ImRl / vrXv / 7000 + RVXx8ZqBdzsc6BpQtI8ZArNgcsfj449tfffXVl19 + iRYgpxQazczOQCidP4EJWyHwMefn53nGLl68eOfOnd / 97ncQa3l5mRkZA37gc5XOsWDBuwhDA + hh1WtlOkA1VOHq2tqPD + 5DQV5CwYnKrjHz / f7SxcW7d +/ y0dCGkIysUXJHJdG5KpFVwcriiM0O86owmDnMKOiCCegiZLzjgIA6aEmuMtYWKZRuaAOLSSIWXNEnxaKKObQ8S12KK5mUxSl6heCPTqlMLOPgQ98HX7vKzLAwur0OJntdV650yH / EGK / MOeglAx + k1iuTgWhF9fmureQKs9ZUi1kz8xwLoeQs6JWJdSToSqHcPKHWYK7UTjLR3zywAOIEJrvyAbn00C4 + wWF8LS0XodWfmZVVGXdR9eZCaYJH / zEVQBJthc9b955YMybDXO4rdaFhBR6er6woudQ54zjWda0hIjGMZ + jS4sK1a1ehWoo1vCGSc0e / D7ArGKqBf4ir5OkpxhnDXl9xjOSFkQ8 + RnDjexvqqp6bn1OIg5mx1oMjliJL3dI50hdkFfwrXSqZWIU5I68m1VxAr7EWV8OpoYzbMzM4sbwPYeicLLH + BQj8Q2LJiZruyphCPuFUkoRyx73ebk8HLVTGDnKQjimtzNX7ne5f / vIXHDzcCfxekxEr5FPArbt3P79z6zbO4NzR7wyAC5FQ / 7gbWMDMpAR1RGLJwDobcZWJxQ3AN40jHvUBycbdxhJY5166dGmeSPMZ7HiWiRXdhWhEJBaxnRDhvR93Yin0ztNCP98zsNYzsSxWS5M2Q2iWgD9CCxtrrFWhAJlQ7kisM7Las8QKRelKmSNXrlxhAZUcWuPXsTvWjxgorNfrwyqWhL1OZ6wz + 6txXj2FAnXYLxbmZxYvXtjZ2nBwKTgfyDKtUCODfp / A9aCRMVoLv + R9zA8NPsxOTy0vLlSu8Gf3ZGQ / li + d73V3S1d8dO3KbLs96HVbtZVWuMAXyjKUzjWSVTGyHOzwK94GmNXvfXT96vLSou / 3xj0fduy91TEZsL8cIW1YVTX3SKlLTe0GbyMfpKwq5xz2IvmxNK1QVCcT6wyL7AptMlBV5fWPrmOakLylwhVgzpQY3jyEkQ9CYz7e6tWrVzGwGGgyE + ssM7dk9u7vHxA3pAhRpSxqUm38C2EsnhAtb9kWwDm3t7d3hqHPTCwlWBop71H9lQA9QkkP3KrKiiO8QhsWzVaFcjHw9qlBpQyJVWHKzcrEOht4H2KDI6Wb1ggqWEV1q5n1ItsavA + duhOZkmT0zhG32vWTh + GsiJWD0ED9snwcaoNk45agR7755v / WVl / Nzc1j / w6CL5yFxqkJZ6jrspDiwwlH1eTtj2 / GQreGZRvnXezNTN3Pb9++TToNldNM1s1ThQgrB6liwr5quJGyy5eX0ewNNdgzsbhPCK2lpSX6l8qd7UNo8t7ECm5iWtHsSpOZWA2F3D8UeFZ1JRlWWOOajfvgh3ucEJXyjaVVJpaaH3G0WIIno9gaGzUIISW + EkHnBZOZWE1asQeXxmUEiVnT01P9QZcqPCYaeMMsbo + qxnx1XfFuXWmJdIdfZ4MchAZO68GRNopolqkpDoRJXB + NY65pq1kHrSzge0OmtqamGXuPBvfKBuLl4VLXZYnVlKBbOpod3qTQwL4MeleqavZ8jYorjuazKmxWi07gIwIzDY0UKoIuY8sz8aaKz6qwoSXFHJv8DjmYGd + 8b76TPRNLQkvwzSaWyKRnoOElRlkVCoe88s1NPgmSUpaGTUcmlu7S7u5u3MzCmtkpxJWl2qaxdu12O3hxsyocD + c7pXmxNKHhS1n1bQ + xvihkidX0emLuk2RA8KG5ayyz5HwnXu59k82sLLEisQ46HSSWfERxsrldRkPhzWx3dweGNbg9X5ZY8dg5gFodXoQiWCO3RgkSrspVdBBrL4quBjfpy6oQEMZBFQ55txv5AJjJ2 + Bi995D5agfxochWC5Y / RDwRyn5DOYsJNVS9H3hXLG5tROstLIOPpiVvnkFq33vCRTyEa0sB6HodPvbu3sXLy6UtWMZqxR47wdFGLxLkRtfmVjHYhW0Ce + 4pqEKhQv2C0XYH / jNbYjlzEGpgQjXNMD1UJQcHQTyHn / D5vbuwqVlBXoC31yl / r3vjhgGd3S1k1WhHa8wL5V9liV2O6tCBQr5amb / GeWNqQyE98wbZmFoZj28bpphVWt2lEqQLLGOBXsHvUIM3bzNxqK7n / YFUZxE6 / kGEmsko3prawu7MHhvzultow3jwpbDOx6vTKxj4R2rOWgj5o3cofX19Yb3jBzZowUw2ImgkttLxGo + GfLvRN5A4DjNpZUaOvyV + GSReBrY8O6jjx8 / 5g4RKmGsjPJmEmvkpbb8pAxEMQNFOy0tbDnFHEddNjB8cZrZr7s6k04eBPI0Ft7mNXA + gh9CD3D4iyVH2b / mal + Y9ghRCxB2 + EWnwKdx6d8XIrSLJ + 8cv4NIFhPhq9oYx / 5G8SAjcqROOm1mkVp5D9MrHIKZyVeFEiQQIm1KaBFiTNpKtDwE06IX / OFXMKH29 / cOOt2Dg95BT + iJWJubm9wbBqlLbMN3NxkGshZu0WoGekEUqlhd8HVVMsPW4hypuRCHgDgExB5dzNTxgbEu8jmqhNaH17XQIwiGUvN0AqgYME14hlrhuN / 4OqRhgF9djOz2Bj0vcRX0yHIc91bv0uC6IC1X8KFqAKfqmnl2xGy3Z / jHbijUjCCkoyRDwlWimuilS5oeY5FvwoklsZz29hDDpBylEfqEkAeew9bW9uvXr9Fu + 3t7ONMlsTjBtFdvXQ04janhjY0ixjdmIFroUgRA1kNMiU + AXgaiPKNfN5Jsbo7a7zaAZ9qNXGTyEcM23IQTC0ppZ0c4JnGdrinSaAs2bfO1u7W5wzlJVwKNzZwEvFIwvZyNDCciOVHKTvt9ViDYm43gJemBM / 6xU1XFxqAw7GIEu6Qg4Ea2BdX5k2pjQQNLG8VUpSurKjKsB5fWkUybm8gntF4MkjnopEpOWV2yap1ZKLzkFjWDVV0bfyg4EWtidsGUInMxVQtSjBCrijuCHhqpPUQ7qYI4WV68eDETweoytpGup6fbWiRBRi / 7fUwlVlDNnFlS6nFoaUYGhJQal + P16 / XV1VUuCs + oTjg821ncBFJ / ExKpwVpyACmy3I9p7SOLoHHfBTNVsIG6rFwhaiV6JYMpnQj7BmleR / iE9LoUwYCCWMS / j9DejrqYeim9EUuxPfxtHrHMzNUYQ1ABeXToIEDeeGlAcwZFeMS2d7Zfra29evXT3t5uSnDjOCLcRiDOiFLptImHvV1vjmSgpdc2pPgCNMXsX15eunz5CgzDCItaMijcJaOCEczU + Y5JJhpILFdOdemyp66yRYGkTus1npftra3Nra0XKytEXeL6ZQCXUIh2qlosI4BoSWiZqU5JNHZjtwt6nGKEcXfMuV63Oywmq7pyMM73G0csqIF5zWJN75UZGUm4nTaj / fRThIzxJKJOXYVlmJkuKAQqnfORXigKOITEgmE01GTLBex9LFdYxT1yrqROwLx3kn9NlFj9XqIOduXr1z + DV69eUTaTzFIw7NM6Xbs7Q0aIfKTyFYs9muQExrgnbty4QQQJAaZ1qA++NnPWSFVYuDpE9kAUhNPz58 / X1ta6XagW5L3UFo + M5QnMgurDeS6SxziJK2wsXXmgExBaKEcEGMHvUAQ0jhX + jIPQKdr1C2JZiaxilffPf / 7z++ +/ x7epgAxIC8OR + vdTrwPOgD0pFJvauwEGiVWco + ogTBTu16A / wBmGbf8vNd4hgZIFYDoDxfKSb3PYYNzeOXi28hxgV + mJedN + Si8zmT5o6sSIyfHmpG6ltkxrt / F / Td++cePK5SV8E2YO / qVMJLkeh2OUp0YsaWjlOclNAsPgO9YfApafwvpnKyurqz / v7O3CPHrhKzGyscZTRgqpmYJIpYNES5cWaA2Mi1U6VNJhxGhhfGo2lvguKSUuC7AKuw8n55Mnj39eXzerw5AMGysdl4VccMEHhEJ7 + kaEtvQZpqDGp5nznkgqo09jpalgS33zzf + urq6h2eF3iqWrZ2smFmh + 6o7sHG4fqgY98 + OPP / 7tb39j4ZVW7ikf7jSJJd0nlSxtiKZj / tmzZ3//+98f3L8PeQiw4w7F58Y5ye2GpTVGqjALrR7o95RYgW3zj3/84969e9xENTnnvp9yEFoWnEShBBLLvSdPnqysrGBjidKSlK3pqUEcyYPS5L10M0QgoLFZaZ67N+A1vYGRS9xcRBfLxk/u3CGqbdqEu/CcfHIby8ySUrNYrOcLHGvTIfiXL1+S6wijlUHrgVYNZQXJGA9l8xW80WJ8kP31ZsGZ88Fr+wVSSNjvDnfXjZs3bt28hUcCnems0K0fRKDKIMmRiDXsRNDRlXVZT3W6HaQUsopqBf1MMM45YrlE85GRUgDgmXPy17NKY1+Wjz/+eGlxod/tYPUkV5nMnqOqwiSHAMSBvKz+EFQoXQb4F3zi1dtYlSk1AQkV0j/a9xXXEne/D27fIlPC6iIFH2HV8TzvZgaBFIHZ3Ny+//AhsgpTLlF14qmT4SKSp2ljc4OUzPk5KjvazpWpYuUYq0I5zSSoyHJ5+PDh/fv3GfMXxSc4V0wyMkarx1SpABm++eYbLCJ+iH5MCdBvwr35AxehxSALwO+++44/VLoSpO2Kz8OKLyPRAMgxCZlIH2e1+OzZcziQ6mLe9Mg77eeZ/opsMZ2KXf/o4SOSqVkdQE+50SQbxbBzggwRw0enE1v2UfNy796PEEMeeRUXKaCcSGYq8pQtleq70XTyquN+NVBWA29Ftqkygq+d8Q1znmz6zz77jNVi8qLDH45imyGWUgqeihrwW2CkowExrUS4Xt8j2tRI4DwjA1JVJvdkgU6EW19++SXcgjloRtRa0mYulSaLdKwtOYnUFwSdDKnAP5OvKiNDic5d50pSbeDWt99+S4YwlBKLkjmv9aSJZWhAuAWlkFXoRxILRUC50TMyvA8cCR1rB2v4hL0ltkAeOJec6krdGqSeJ3jVWQNyVNxR51khZGSoQ4JTRoJogzWFioNFqVUOg/I//+v3iDX4Aw0h0cuXq6wkeVlWFbVDwYrSaq+U1YwMc0XMLYczMIRBTDsoMLGWlpZpJYGpVZW1WbDVn9axq7DWEWV0S/jr//wVlQnpQmJo6jKbkZGiwzpK0YEQvvrtb+98+imasVVXZRHKr//4J0hXGLCnT58DTjPn3t07NSPDLO1fjQCjaBELCq+nQ9H94b//hLKUdwvHFfkwjItjIiM76LHf8T7ALR984YMLQQLNYbBTVnrcXMGMDNVcQCykEkZ9VVZqPy816WNxaTflbR0RGRlpGzMK39kXiAEMcpygYA61y9DtmHHAjAxLrUdodbazs60uI04OdzU9UwT6OJ08MzKCZJNyXhBPsdLalb//wx+ZojaQqeNSKiNDBjpgoKLAK1cut6raqQaVBC6O79N4OCMX9cMqiMQS0IlG6ip7gmzjjAyLSMtDuETClffeMYGjgdfQLfXAzMg4wQY2gCFZxxhbJZ53YjhUCxKpVnT6pNowI7tJVdhjtAy0tdebFFNTLy9iyadVnBgZuX1S4f/j3/79/wMoJ9yWdfnH9AAAAABJRU5ErkJggg==";
                        }
                        
                    }
                }

                return experto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Experto> GetByContactoId(int contactoid)
        {
            try
            {
                //Obtener expertos con su linea de desarrollo 
                var experto = await _cr.Expertos
                    .Where(e => e.ContactoId == contactoid).AsNoTracking().FirstOrDefaultAsync();

                return experto;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        /// <summary>
        /// Crea un nuevo registro de experto
        /// </summary>
        /// <param name="experto"></param>
        /// <returns></returns>
        public async Task Create(Experto experto)
        {
            try
            {
                InvestigadorPorExpertoRepository repo = new InvestigadorPorExpertoRepository();
                experto.FechaRegistro = DateTime.Now;
                _cr.Expertos.Add(experto);
                await _cr.SaveChangesAsync();
                foreach (var obj in experto.Investigadores)
                {
                    InvestigadorPorExperto inv = new InvestigadorPorExperto();
                    inv.ContactoId = experto.ContactoId;
                    inv.ClavePersona = obj.ClavePersona;
                    inv.FechaRegistro = DateTime.Now;
                    await repo.Create(inv);
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }

        public async Task<Experto> CreateSinInvestigadores(Experto experto)
        {
            try
            {
              
                PersonasRepository p = new PersonasRepository();


                if (experto.TipoExperto == 2)
                {

                    if (experto.ContactoId > 0)
                    {
                        experto.Contacto = await obtenDatosContacto(experto.ContactoId);
                    }

                }
                else {
                    experto.Adjunto64 = await p.ObtenerFotobyclavepersona(experto.ClavePersona);

                }


                experto.FechaRegistro = DateTime.Now;
                var obj =   _cr.Expertos.Add(experto);
                await _cr.SaveChangesAsync();


                InvestigadorPorExpertoRepository repo = new InvestigadorPorExpertoRepository();
                InvestigadorPorExperto inv = new InvestigadorPorExperto();
                inv.ContactoId = obj.ContactoId;
                inv.ClavePersona = experto.investigadorLiderAsociado;
                inv.FechaRegistro = DateTime.Now;
                await repo.Create(inv);

                obj.Adjunto64 = experto.Adjunto64;
                obj.Contacto = experto.Contacto;
                

                return (obj);
               
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        private static async Task<Contacto> obtenDatosContacto(int id)
        {
            ContactosRepository rep = new ContactosRepository();
            Contacto obj = new Contacto();

            obj = await rep.GetContactosRegistradoCP(id);

            try
            {
                var archivo = obj.Adjunto.RutaCompleta;

                Byte[] bytes = File.ReadAllBytes(archivo);
                String file = Convert.ToBase64String(bytes);
                obj.Adjunto64 = file;
            }
            catch (Exception)
            {
                obj.Adjunto64 = "iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAdkklEQVR4XuzSIQ4AIBADQf7 / 1h5vIDkDDkWCmFEVlTvqARAWwkJYCAuEhbAQFggLYSEsEBbCQlggLIT1OYSFsBAWSarNdrvtZ1q1c7PaO / PeOI5r7fep7h5yuEikSG2OFltObOsfxy8Q3Avcz3VvnNx8wiA3SHxvEG / aF0qkbHFfZqt6f6gHLIxHAkRSVNgzrEdUs6bYJGa6nz7n1NmqKjKKwg7BOISgGeccY + 99iHARxRD0UybT7wJmOGYY5MrEqqqKY + LQMOHSQEg / 1SCRT5NpPiNLrMSGUVk1ItIGg0Gv15N80pH5fr + fuGgRRUYmliB + cBzWhmmQJBlkarfbIULzaVCWZWIV / OOYUX799dfF + YX4UYRoKlVVCeAKkol5F4kyQjgdhsFvVVUtkSaCCm + VXmZZYk0KghXG / 7ff0ajXOIGDIZl8t3Owv79 / cNDh2O12IUq30 + l0O71eP4qi4Bw0quqqciWDcmZmdnp6Kh6nmXfO6lYrCjmJOR9paMxbYQOmfIC9sJMTEvOSJs3EGiOJBCpXVwxlD0UDvKgiYFKncwBzdiI2Nja3trZ4WXCGcRgxx / kmmAbmDGkF4ZiYak3Nzc222zMXL16Ynm7PzMy029Nl1YrK0UNszoZvkMjKyvd7ECutGGSxMcirwvGBucLVQeaQDPNDo3tvb299fZ2PD5kYQzLZ5BxQiLwcMPN2rSbOBc0PW10ANVrV9fzc3KWI + fn5CxcumLmoJYM4VFqAR / 1BD84xI4ZxQibW + AgsV3Lvur1uq9VCWyGNoNFmBJTa3d2FEHVdW4QzC1GEIISOvsQTVyAWvwUd + WvpLzCGNAsLC9euXbty5QovoR1n1qUVHgxEWmlN2FyMDTKxrERiWWlhELa2t1ZXV1 + 9erWxsSEBI + HE0UcML / dEl6OwasRISn8kzYttCwuL165dXV5eRkUyFQY9sUrvYfIkVjXZBhasMecwnVYiUHkWgSCRj0DuTd1gDYBU4TuNHtFiEJF + N80nbiEsmfnpp1dra6uLi4s3bty4fvXyHJ6LIiDAWCJIsGV3wzhAd7d0LPDu33 / 4w48 / vHz5Ug4nBIM4NEyINBCO7kDXaRJ7AjMWwXiYahJL0GhjYx1lDJ1ZTgLpUP1WVoWNgFQMDIArSKAQIWEjAfDs2bMHDx9tbe / 1w8AK08myfkbWe5pJlDoBiUfYNuLEFxhbYb7wod + bbrWuX79269YtLDC4juhCsEkbioJ6n5lYZwAFWEQp3cKDgwMZ6RhSz58 / X1tb29nbc65VOBMRm + EuCqhJPA7Q7Pr165988gnckgkPsfRsnGXMMRMrqaFEMskknAgPHjxYfbnqg6 / qli / KUDTqJoXSChcCa1UmsLru3Llz9epVpKw0cnpOGGcb6wyAcNLVl5YpI8iI + vbbbxHDrakWX3DPe3k0mwMrguettlo1JtfO7i5efmbn5ub0KZJ6HWuh5YqxBWEWqY + 08nr8 + DGswpvA2JnzAzjX0IceqwrLiqj23OwsTv9Hjx69ePGCRasNuzDOBJlYxHwRU3zJaU4 + J7cHzycKkdUWiibqxzJYA1eszlUlxyRot3d27t +/ j / N2cOZ8yn4sV1aFlT7066n2xub2dz / c29jaiUaV9QaBo1k5CNAqNNBvG8yK + D5D4L / Vrand / c4P9x64qsZHH7y09yAb72dgqHjvvBlKEA2Ctf7kyRPUIuIq + KBAnnyk1lTnrQ29Oam / fq9 / +fLlu3e / WLx0aW93p7KzSLPJqjCFZfBXoQQZy / VQWMp7YthQmP5rbIbWZklYt + qVFytPnz1TxkS2sc6GVWVV4rLCpf706VOiy1objulnMbPkacOK51Fp1a2z + ThZYpk5 + PTw0cPt7W3yn8Y6OyAFLkmz2d / bRwDv7u2dicDNxDKk1pMnTzfWN4gnp2jMBJR1uNLxqDx69DDNZGJ9QKRUFgbKNCcN5uWLFxjsZANLm4w1n5KxpfDiixcvyRzDapRC / FDBqEwsM0vEkpH +/ PkKrkXZJSqCmKQqNJzy2I5Y8You8AEzsT4IUla4As84QslwOugcWITSYCanWNQMfhFKlzMoRQ9zrPD0MZzqxMTTZ09fvlhjdigXYNLQ63TqusJfqlygDyuVcxDauWjbPn500OlNTU2Hw1KqCcsZd85KMyzIpaWl2dlZNOPpP0JZFSqBOCkFldaYFWIVEKsYTBa3SoIKJJZh0RP9hGT6gJlYH4ph66 / XeYL9wBNolrgSqyZJIcaEHxBWV9eoJiJU9YYR6XOs8NSMd + ccV / nPf / 5zp9t1Za1Y7aSiCqZa6q / +32 / JYybNJhpbA1inQHYRLIoGyxLrveAiSLeK + eBwys5BDxzjC73PR5aTpRBMR16GrApPId7svSdHVEUHk84rKBOk5V +/ Xid49aFWhVlimVnssLChMRd + smGFSSqzCqavxOmzKhNLD67Wg3p2GYdJZ5YrnfyilLXSGFUVkSFkYn2AQkIc7goawqnzILEktaKZtQ2xTj + qk20sM6NskCWhGDbQVZ5ghKLX7zFQpeHOzvbu7k5ZVkxkYp3ykrAToYlkyU4sLI1M0pp2cB + k6CgHoRFXCC0GkViVD36yPQ5WDJcWGhILF7yZy8Q6NahvB0vCZGcYhwkXWAaCT3lmYXNzi2LEU14OZ2LxsPLI / sLqcloYTjKz / JDui89Vz53up86qsAu6vWi9WoyjBWdusk0ss + FGqAVmgPdePyk0HeL4RMhpM9DIMNUPDrqPHj4xc8TKqqqFrA3AikmGj9wCgW / mB / 7CxYtk0aAQnSuZMTt5WmmWWKZjv + epvXNWhcCUMysZTHq / Zxefn / SAGZ3CeWnm + OJHFpFL7E8I5bmjCJSApSAaOIc7SWENqCFbCP50aniyg3Rvfy + VsvBdFc / nDfv7e4PBeAR23LhIrL1diJWIJl7Z + SPWvjwOugRC8T7IEgstIELJ / jhvqlCmVLfTjdGtLLHeO51BR8DDGiIYx2NxrgCT5NbC1lRaKS8zsU6836mlejokVjTah5kHzh29Oh15s4JzmVjHhCyH4bWPcpGVQ5Iu8fmEtt + RlxhkP9ZxEVKbBgax0eiozXG + IA5FW9PMvVcTlGy8 / 5JYaoJ3CEbnD9ol5eRKMKtCySTvg0VoE0rx6TyDC5MyZ07oa8jGO + xyzlKRKi / zTt5pe54TBnMysUQmbYIKmMniCpSuBDHr38pYapEdpCfByEXL6A / 6aoOrdgIWkYmV8b6Zf / 0 + pOp7709vf / JMrAzjEHwQ3qO4PhNr1B1qxblG0GbpKQ3r / Qys7MeSzM8mVyiCixCvGo6q4S1AzDh6rYAKYOd6bahNneQrVsbfsVuxZWKlF4O4d9ypOdwzctqMltQ8o3VVv2 + IMCMTK6XKeB + 0k2p7pm0jJarvybCMvCrU1vNpMuPkcfgchMbFHJVgxQQ5k3Qe88EzE9I15SReTTTiBwxvUsmc4 + vYZkFubmtmPm4NUFU1jSEfPXz0ev016d6j / LNi4qFnJy2HvR / MzM5iG9y8efOj69e4QoN + x5llYh3VEejKFhY7bdbYKZn9 + xSHzspPHec6Bwdsef / FF1 / cvHmj3 + lY4bMqPAKsUCcMH8LKygpbQtITq65ry8RSL3vvkVj0UWbL / s2tLXM5CH10eRUHO9vb7FLk43WUZytDixgzY + PPn3 / 6efXlS / Xozg7SI0E53XRHpnFPu91WD6PMLYDkds6xmmHPYhpJbu / sWJEl1nHKKFTvJYe7jprMEgvALa4JQgsjgd1A4z5CIRPrnTBtX6sK1X5MQRKrMtKun6lHSL / XN5WCZWIdaUeGwrqov4iUgJuR9piV0JL0ClkVHj1VUs + lWCUVkLmVdqoCYpgnRzl4y9kNR4cPXi6GkcrMLLGQUhro6CxLrGMgBB / a09NaSwNdx4SMEDHdbscd / I / qPc6xQr4CjobkpEkO0gwzS9vJzrTbU1Ot7Mc6RtFA6RzXrFVV / W7PQamBV0BW5GLIwNvkF0 + o9TYDgZeOGe8HoVf4MNOarlyJV + aoAitnkLrC5tqzM9Ptve3dOm6HPCxdTcdJj0M7P5p4Zj6YYWb1sbSmW1OzMzNHTU3OqtCsUP8 + ttdeXFiU9Y5OtDdSG + xcmlbODMPACrswP3 / hwoWcj3UMA0tlFIwvX74MvfYPDt40IyycXx8pgGGwam5 + PhPr6AguAqHFtYNbsOpN5 / v55FXqajE7O7uwsFAfJwKdbSxL / gUz + 9WvfkVsh4D0WzTmuSSWvKMfffTR8vJlTC1emmWJdQxpH1hUM1hcXLx27RpWRXIMpqd2uJhHx8mjkXKwNVYYhyOy6vr16 + T6eQUkCst76RwR5gcByGcjbxZyS9ExzRz2uTU5o2WWcfKk5SVbwUMlY8B7zxHb4LPPPltYuMjLw5NCllhHDVxgs6tDJHTB0vrNb37z + eefI73gELkiHAO0Us1FXDNCKbg1YQtAZaF1ImRl / vrXv / 7000 + RVXx8ZqBdzsc6BpQtI8ZArNgcsfj449tfffXVl19 + iRYgpxQazczOQCidP4EJWyHwMefn53nGLl68eOfOnd / 97ncQa3l5mRkZA37gc5XOsWDBuwhDA + hh1WtlOkA1VOHq2tqPD + 5DQV5CwYnKrjHz / f7SxcW7d +/ y0dCGkIysUXJHJdG5KpFVwcriiM0O86owmDnMKOiCCegiZLzjgIA6aEmuMtYWKZRuaAOLSSIWXNEnxaKKObQ8S12KK5mUxSl6heCPTqlMLOPgQ98HX7vKzLAwur0OJntdV650yH / EGK / MOeglAx + k1iuTgWhF9fmureQKs9ZUi1kz8xwLoeQs6JWJdSToSqHcPKHWYK7UTjLR3zywAOIEJrvyAbn00C4 + wWF8LS0XodWfmZVVGXdR9eZCaYJH / zEVQBJthc9b955YMybDXO4rdaFhBR6er6woudQ54zjWda0hIjGMZ + jS4sK1a1ehWoo1vCGSc0e / D7ArGKqBf4ir5OkpxhnDXl9xjOSFkQ8 + RnDjexvqqp6bn1OIg5mx1oMjliJL3dI50hdkFfwrXSqZWIU5I68m1VxAr7EWV8OpoYzbMzM4sbwPYeicLLH + BQj8Q2LJiZruyphCPuFUkoRyx73ebk8HLVTGDnKQjimtzNX7ne5f / vIXHDzcCfxekxEr5FPArbt3P79z6zbO4NzR7wyAC5FQ / 7gbWMDMpAR1RGLJwDobcZWJxQ3AN40jHvUBycbdxhJY5166dGmeSPMZ7HiWiRXdhWhEJBaxnRDhvR93Yin0ztNCP98zsNYzsSxWS5M2Q2iWgD9CCxtrrFWhAJlQ7kisM7Las8QKRelKmSNXrlxhAZUcWuPXsTvWjxgorNfrwyqWhL1OZ6wz + 6txXj2FAnXYLxbmZxYvXtjZ2nBwKTgfyDKtUCODfp / A9aCRMVoLv + R9zA8NPsxOTy0vLlSu8Gf3ZGQ / li + d73V3S1d8dO3KbLs96HVbtZVWuMAXyjKUzjWSVTGyHOzwK94GmNXvfXT96vLSou / 3xj0fduy91TEZsL8cIW1YVTX3SKlLTe0GbyMfpKwq5xz2IvmxNK1QVCcT6wyL7AptMlBV5fWPrmOakLylwhVgzpQY3jyEkQ9CYz7e6tWrVzGwGGgyE + ssM7dk9u7vHxA3pAhRpSxqUm38C2EsnhAtb9kWwDm3t7d3hqHPTCwlWBop71H9lQA9QkkP3KrKiiO8QhsWzVaFcjHw9qlBpQyJVWHKzcrEOht4H2KDI6Wb1ggqWEV1q5n1ItsavA + duhOZkmT0zhG32vWTh + GsiJWD0ED9snwcaoNk45agR7755v / WVl / Nzc1j / w6CL5yFxqkJZ6jrspDiwwlH1eTtj2 / GQreGZRvnXezNTN3Pb9++TToNldNM1s1ThQgrB6liwr5quJGyy5eX0ewNNdgzsbhPCK2lpSX6l8qd7UNo8t7ECm5iWtHsSpOZWA2F3D8UeFZ1JRlWWOOajfvgh3ucEJXyjaVVJpaaH3G0WIIno9gaGzUIISW + EkHnBZOZWE1asQeXxmUEiVnT01P9QZcqPCYaeMMsbo + qxnx1XfFuXWmJdIdfZ4MchAZO68GRNopolqkpDoRJXB + NY65pq1kHrSzge0OmtqamGXuPBvfKBuLl4VLXZYnVlKBbOpod3qTQwL4MeleqavZ8jYorjuazKmxWi07gIwIzDY0UKoIuY8sz8aaKz6qwoSXFHJv8DjmYGd + 8b76TPRNLQkvwzSaWyKRnoOElRlkVCoe88s1NPgmSUpaGTUcmlu7S7u5u3MzCmtkpxJWl2qaxdu12O3hxsyocD + c7pXmxNKHhS1n1bQ + xvihkidX0emLuk2RA8KG5ayyz5HwnXu59k82sLLEisQ46HSSWfERxsrldRkPhzWx3dweGNbg9X5ZY8dg5gFodXoQiWCO3RgkSrspVdBBrL4quBjfpy6oQEMZBFQ55txv5AJjJ2 + Bi995D5agfxochWC5Y / RDwRyn5DOYsJNVS9H3hXLG5tROstLIOPpiVvnkFq33vCRTyEa0sB6HodPvbu3sXLy6UtWMZqxR47wdFGLxLkRtfmVjHYhW0Ce + 4pqEKhQv2C0XYH / jNbYjlzEGpgQjXNMD1UJQcHQTyHn / D5vbuwqVlBXoC31yl / r3vjhgGd3S1k1WhHa8wL5V9liV2O6tCBQr5amb / GeWNqQyE98wbZmFoZj28bpphVWt2lEqQLLGOBXsHvUIM3bzNxqK7n / YFUZxE6 / kGEmsko3prawu7MHhvzultow3jwpbDOx6vTKxj4R2rOWgj5o3cofX19Yb3jBzZowUw2ImgkttLxGo + GfLvRN5A4DjNpZUaOvyV + GSReBrY8O6jjx8 / 5g4RKmGsjPJmEmvkpbb8pAxEMQNFOy0tbDnFHEddNjB8cZrZr7s6k04eBPI0Ft7mNXA + gh9CD3D4iyVH2b / mal + Y9ghRCxB2 + EWnwKdx6d8XIrSLJ + 8cv4NIFhPhq9oYx / 5G8SAjcqROOm1mkVp5D9MrHIKZyVeFEiQQIm1KaBFiTNpKtDwE06IX / OFXMKH29 / cOOt2Dg95BT + iJWJubm9wbBqlLbMN3NxkGshZu0WoGekEUqlhd8HVVMsPW4hypuRCHgDgExB5dzNTxgbEu8jmqhNaH17XQIwiGUvN0AqgYME14hlrhuN / 4OqRhgF9djOz2Bj0vcRX0yHIc91bv0uC6IC1X8KFqAKfqmnl2xGy3Z / jHbijUjCCkoyRDwlWimuilS5oeY5FvwoklsZz29hDDpBylEfqEkAeew9bW9uvXr9Fu + 3t7ONMlsTjBtFdvXQ04janhjY0ixjdmIFroUgRA1kNMiU + AXgaiPKNfN5Jsbo7a7zaAZ9qNXGTyEcM23IQTC0ppZ0c4JnGdrinSaAs2bfO1u7W5wzlJVwKNzZwEvFIwvZyNDCciOVHKTvt9ViDYm43gJemBM / 6xU1XFxqAw7GIEu6Qg4Ea2BdX5k2pjQQNLG8VUpSurKjKsB5fWkUybm8gntF4MkjnopEpOWV2yap1ZKLzkFjWDVV0bfyg4EWtidsGUInMxVQtSjBCrijuCHhqpPUQ7qYI4WV68eDETweoytpGup6fbWiRBRi / 7fUwlVlDNnFlS6nFoaUYGhJQal + P16 / XV1VUuCs + oTjg821ncBFJ / ExKpwVpyACmy3I9p7SOLoHHfBTNVsIG6rFwhaiV6JYMpnQj7BmleR / iE9LoUwYCCWMS / j9DejrqYeim9EUuxPfxtHrHMzNUYQ1ABeXToIEDeeGlAcwZFeMS2d7Zfra29evXT3t5uSnDjOCLcRiDOiFLptImHvV1vjmSgpdc2pPgCNMXsX15eunz5CgzDCItaMijcJaOCEczU + Y5JJhpILFdOdemyp66yRYGkTus1npftra3Nra0XKytEXeL6ZQCXUIh2qlosI4BoSWiZqU5JNHZjtwt6nGKEcXfMuV63Oywmq7pyMM73G0csqIF5zWJN75UZGUm4nTaj / fRThIzxJKJOXYVlmJkuKAQqnfORXigKOITEgmE01GTLBex9LFdYxT1yrqROwLx3kn9NlFj9XqIOduXr1z + DV69eUTaTzFIw7NM6Xbs7Q0aIfKTyFYs9muQExrgnbty4QQQJAaZ1qA++NnPWSFVYuDpE9kAUhNPz58 / X1ta6XagW5L3UFo + M5QnMgurDeS6SxziJK2wsXXmgExBaKEcEGMHvUAQ0jhX + jIPQKdr1C2JZiaxilffPf / 7z++ +/ x7epgAxIC8OR + vdTrwPOgD0pFJvauwEGiVWco + ogTBTu16A / wBmGbf8vNd4hgZIFYDoDxfKSb3PYYNzeOXi28hxgV + mJedN + Si8zmT5o6sSIyfHmpG6ltkxrt / F / Td++cePK5SV8E2YO / qVMJLkeh2OUp0YsaWjlOclNAsPgO9YfApafwvpnKyurqz / v7O3CPHrhKzGyscZTRgqpmYJIpYNES5cWaA2Mi1U6VNJhxGhhfGo2lvguKSUuC7AKuw8n55Mnj39eXzerw5AMGysdl4VccMEHhEJ7 + kaEtvQZpqDGp5nznkgqo09jpalgS33zzf + urq6h2eF3iqWrZ2smFmh + 6o7sHG4fqgY98 + OPP / 7tb39j4ZVW7ikf7jSJJd0nlSxtiKZj / tmzZ3//+98f3L8PeQiw4w7F58Y5ye2GpTVGqjALrR7o95RYgW3zj3/84969e9xENTnnvp9yEFoWnEShBBLLvSdPnqysrGBjidKSlK3pqUEcyYPS5L10M0QgoLFZaZ67N+A1vYGRS9xcRBfLxk/u3CGqbdqEu/CcfHIby8ySUrNYrOcLHGvTIfiXL1+S6wijlUHrgVYNZQXJGA9l8xW80WJ8kP31ZsGZ88Fr+wVSSNjvDnfXjZs3bt28hUcCnems0K0fRKDKIMmRiDXsRNDRlXVZT3W6HaQUsopqBf1MMM45YrlE85GRUgDgmXPy17NKY1+Wjz/+eGlxod/tYPUkV5nMnqOqwiSHAMSBvKz+EFQoXQb4F3zi1dtYlSk1AQkV0j/a9xXXEne/D27fIlPC6iIFH2HV8TzvZgaBFIHZ3Ny+//AhsgpTLlF14qmT4SKSp2ljc4OUzPk5KjvazpWpYuUYq0I5zSSoyHJ5+PDh/fv3GfMXxSc4V0wyMkarx1SpABm++eYbLCJ+iH5MCdBvwr35AxehxSALwO+++44/VLoSpO2Kz8OKLyPRAMgxCZlIH2e1+OzZcziQ6mLe9Mg77eeZ/opsMZ2KXf/o4SOSqVkdQE+50SQbxbBzggwRw0enE1v2UfNy796PEEMeeRUXKaCcSGYq8pQtleq70XTyquN+NVBWA29Ftqkygq+d8Q1znmz6zz77jNVi8qLDH45imyGWUgqeihrwW2CkowExrUS4Xt8j2tRI4DwjA1JVJvdkgU6EW19++SXcgjloRtRa0mYulSaLdKwtOYnUFwSdDKnAP5OvKiNDic5d50pSbeDWt99+S4YwlBKLkjmv9aSJZWhAuAWlkFXoRxILRUC50TMyvA8cCR1rB2v4hL0ltkAeOJec6krdGqSeJ3jVWQNyVNxR51khZGSoQ4JTRoJogzWFioNFqVUOg/I//+v3iDX4Aw0h0cuXq6wkeVlWFbVDwYrSaq+U1YwMc0XMLYczMIRBTDsoMLGWlpZpJYGpVZW1WbDVn9axq7DWEWV0S/jr//wVlQnpQmJo6jKbkZGiwzpK0YEQvvrtb+98+imasVVXZRHKr//4J0hXGLCnT58DTjPn3t07NSPDLO1fjQCjaBELCq+nQ9H94b//hLKUdwvHFfkwjItjIiM76LHf8T7ALR984YMLQQLNYbBTVnrcXMGMDNVcQCykEkZ9VVZqPy816WNxaTflbR0RGRlpGzMK39kXiAEMcpygYA61y9DtmHHAjAxLrUdodbazs60uI04OdzU9UwT6OJ08MzKCZJNyXhBPsdLalb//wx+ZojaQqeNSKiNDBjpgoKLAK1cut6raqQaVBC6O79N4OCMX9cMqiMQS0IlG6ip7gmzjjAyLSMtDuETClffeMYGjgdfQLfXAzMg4wQY2gCFZxxhbJZ53YjhUCxKpVnT6pNowI7tJVdhjtAy0tdebFFNTLy9iyadVnBgZuX1S4f/j3/79/wMoJ9yWdfnH9AAAAABJRU5ErkJggg==";
            }

            return obj;
        }






        /// <summary>
        /// Actualilza registro de experto
        /// </summary>
        /// <param name="experto"></param>
        /// <returns></returns>
        public async Task Update(Experto experto)
        {
            try
            {
                var expert = await _cr.Expertos.FirstOrDefaultAsync(e => e.ExpertoId == experto.ExpertoId);
                if (expert != null)
                {

                    IEnumerable<InvestigadorPorExperto> investigadoresexp = _cr.InvestigadorPorExperto
                        .Where(e => e.ContactoId == experto.ContactoId).Select(e => e).ToList();

                    if (investigadoresexp != null)
                    {
                        _cr.InvestigadorPorExperto.RemoveRange((IEnumerable<InvestigadorPorExperto>)investigadoresexp);
                        await _cr.SaveChangesAsync();
                    }
                    if (experto.Investigadores.Count > 0)
                    {
                        InvestigadorPorExpertoRepository repo = new InvestigadorPorExpertoRepository();
                        foreach (var obj in experto.Investigadores)
                        {
                            InvestigadorPorExperto inv = new InvestigadorPorExperto();
                            inv.ContactoId = experto.ContactoId;
                            inv.ClavePersona = obj.ClavePersona;
                            inv.FechaRegistro = DateTime.Now;
                            await repo.Create(inv);
                        }
                    }

                    _cr.Entry(expert).CurrentValues.SetValues(experto);
                    await _cr.SaveChangesAsync();

                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


        public async Task UpdateComunidadExperto(Experto experto)
        {
            try
            {
                var expert = await _cr.Expertos.FirstOrDefaultAsync(e => e.ExpertoId == experto.ExpertoId);
                if (expert != null)
                {                  
                    _cr.Entry(expert).CurrentValues.SetValues(experto);
                    await _cr.SaveChangesAsync();

                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }



        /// <summary>
        /// Eliminar registro de experto
        /// </summary>
        /// <param name="expertoId"></param>
        /// <returns></returns>
        public async Task Delete(int expertoId)
        {
            try
            {
                var expert = await _cr.Expertos.FirstOrDefaultAsync(e => e.ExpertoId == expertoId);
                if (expert != null)
                {
                    _cr.Expertos.Remove(expert);
                    await _cr.SaveChangesAsync();
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message, e);
            }
        }


    }
}
