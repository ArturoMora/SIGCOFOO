using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace INEEL.WebAPI.Utilidades
{
    public static class Texts
    {
        private static string stopES = "ej de la que el en y  a aun aún los del se las por un para con no una su al es lo como mas más pero sus le ya o  fue este ha si sí porque esta son entre esta está cuando muy sin sobre ser tiene también me hasta hay donde han quien están estado desde todo nos durante estados todos uno les ni contra otros fueron ese eso habia había ante ellos e  esto mi mí antes algunos qué unos yo otro otras otra él tanto esa estos  mucho  quienes  nada  muchos  cual  poco  ella  estar  estas  algunas  algo  nosotros  mi mis tu tú te ti tu tus  ellas  nosotras  vosotros  vosotras  os mio mia mios mias mío mía míos mías tuyo tuya tuyos tuyas suyo suya suyos suyas nuestro nuestra nuestros nuestras vuestro vuestra vuestros vuestras esos esas estoy estas estás estamos estais este estes esteis esten estare estaras estara estareis estaran estaria estáis esté estés estemos estéis estén estaré estarás estará estaremos estaréis estarán estaría estarias estariamos estariais estarian estarías estaríamos estaríais estarían estaba estabas estabamos estábamos estabais estaban estuve estuviste estuvo estuvimos estuvisteis estuvieron estuviera estuvieras estuvieramos estuviéramos estuvierais estuvieran estuviese estuvieses estuviesemos estuviésemos estuvieseis estuviesen estando estada estadas estad he has hemos habeis habéis haya hayas hayamos hayais hayáis hayan habre habras habré habrás habrá habremos habreis habran habrias habréis habrán habría habrías habriamos habríais habrían habiamos habríamos habríais habrían habías habíamos habíais habían habian hube hubiste hubo hubimos hubisteis hubieron hubiera hubieras hubiéramos hubierais hubieran hubiese hubieses hubiésemos hubieseis hubiesen habiendo habido habida habidos habidas soy eres somos sois sea seas seamos seáis sean seré serás será seremos seréis serán sería serías seríamos seríais serían era eras éramos erais eran fui fuiste fuimos fuisteis fuera fueras fuéramos fuerais fueran fuese fueses fuésemos fueseis fuesen siendo sido tengo tienes tenemos tenéis tienen tenga tengas tengamos tengáis tengan tendra tendre tendré tendrás tendrá tendremos tendréis tendrán tendría tendrías tendríamos tendríais tendrían tenía tenías teníamos teníais tenían tuve tuviste tuvo tuvimos tuvisteis tuvieron tuviera tuvieras tuviéramos tuvierais tuvieran tuviese tuvieses tuviésemos tuvieseis tuviesen teniendo tenido tenida tenidos tenidas tened podrian podriais aquel unas tras algún alguno alguna algunas estais estan atras ambos poder puede puedo podemos podeis pueden hacer hago hace hacemos haceis hacen cada fin incluso primero conseguir consigo consigue consigues conseguimos consiguen ir voy va vamos vais van vaya gueno tener teneis aqui mio ellas nosotros vosotros vosotras si dentro solo solamente saber sabes sabe sabemos sabeis saben ultimo largo bastante haces muchos aquellos aquellas entonces tiempo verdad verdadera cierto ciertos cierta ciertas intentar intento intenta intentas intentamos intentais intentan dos bajo arriba encima usar uso usas usa usamos usais usan emplear empleo empleas emplean ampleamos empleais valor eramos modo bien cual mientras podria podrias podriamos";
        private static string stopUS = "a about above across after afterwards again against all almost alone along already also although always am among amongst amoungst amount an and another any anyhow anyone anything anyway anywhere are around as at back be became because become becomes becoming been before beforehand behind being below beside besides between beyond bill both bottom but by call can cannot cant co computer con could couldnt cry de describe detail do done down due during each eg eight either eleven else elsewhere empty enough etc even ever every everyone everything everywhere except few fifteen fify fill find fire first five for former formerly forty found four from front full further get give go had has hasnt have he hence her here hereafter hereby herein hereupon hers herse him himse his how however hundred i ie if in inc indeed interest into is it its itse keep last latter latterly least less ltd made many may me meanwhile might mill mine more moreover most mostly move much must my myse name namely neither never nevertheless next nine no nobody none noone nor not nothing now nowhere of off often on once one only onto or other others otherwise our ours ourselves out over own part per perhaps please put rather re same see seem seemed seeming seems serious several she should show side since sincere six sixty so some somehow someone something sometime sometimes somewhere still such system take ten than that the their them themselves then thence there thereafter thereby therefore therein thereupon these they thick thin third this those though three through throughout thru thus to together too top toward towards twelve twenty two un under until up upon us very via was we well were what whatever when whence whenever where whereafter whereas whereby wherein whereupon wherever whether which while whither who whoever whole whom whose why will with within without would yet you your yours yourself yourselves";
        private static HashSet<String> hashSet = null;
        private static List<String> listSpecialCharacteres = null;

        private static HashSet<String> stringToTokensInHash(string str)
        {
            if (hashSet == null)
            {
                hashSet = new HashSet<String>();
            }
            string[] items = Regex.Split(str, @"\s+");
            foreach (string item in items)
            {
                //System.Diagnostics.Debug.WriteLine(item);
                hashSet.Add(item);
                //System.Diagnostics.Debug.WriteLine("SIZE: " + hashSet.Count);
            }
            return hashSet;

        }
        /// <summary>  
        /// Recupera una coleccion HashSet de stopWords del idioma Español e Ingles
        /// </summary>  
        public static HashSet<string> getStopWords()
        {
            if (hashSet != null)
            {
                return hashSet;
            }
            else
            {
                return stringToTokensInHash(String.Concat(stopES, " ", stopUS));
            }
        }
        /// <summary>  
        /// Recupera una coleccion HashSet que representa la diferencia de la lista A con respecto a (HashSet)
        /// <param name="b">
        /// B representa el vocabulario de stopWords
        /// </param>                
        /// </summary>
        public static HashSet<string> getDiferencia(HashSet<string> a, HashSet<string> b)
        {
            HashSet<string> result = new HashSet<string>();
            foreach (string item in a)
            {

                if (item.Length > 2 && item.Length<16  && !b.Contains(item))
                {
                    result.Add(item);
                }
            }
            return result;
        }
        public static List<string> getDiferencia(List<string> a, HashSet<string> b)
        {
            List<string> result = new List<string>();
            foreach (string item in a)
            {

                if (item.Length > 2 && !b.Contains(item))
                {
                    result.Add(item);
                }
            }
            return result;
        }
        public static List<string> getSpecialCharacteres()
        {
            if (listSpecialCharacteres != null)
            {
                return listSpecialCharacteres;
            }
            else {
                listSpecialCharacteres = new List<string>();
                for (int i = 33; i < 46; i++)
                {
                    listSpecialCharacteres.Add("" + (char)i);
                }
                for (int i = 58; i < 64; i++)
                {
                    listSpecialCharacteres.Add("" + (char)i);
                }
                for (int i = 91; i < 97; i++)
                {
                    listSpecialCharacteres.Add("" + (char)i);
                }
            }
            return listSpecialCharacteres;
        }

        //public static StringBuilder DeleteSpecialCharacteres(StringBuilder fullText, List<string> deletes)        
        public static StringBuilder DeleteSpecialCharacteres(StringBuilder fullText)
        {
            Regex reg = new Regex("[-<>'‘!¡¿=;“’)(”\\.,\"\\?/\\\\:\\[#%\\*•}{\\^\\]]");

            fullText = fullText.Replace("\\W", " ");                        
            string textoNormalizado = reg.Replace(fullText.ToString().ToLower(), " ");            
            StringBuilder result = new StringBuilder(textoNormalizado);
            return result;
        }
        /// <summary>  
        /// Recupera la extension de un archivo (con el nombre representado en un string)
        /// </summary>  
        /// <returns>
        /// Extension del archivo si existe, null en caso contrario
        /// </returns>  
        public static string getExtensionOfFileName(string fileName)
        {
            string extension = null;
            extension = Path.GetExtension(fileName);
            if (String.IsNullOrEmpty(extension))
            {
                return null;
            }
            else return extension;
        }

    }
}