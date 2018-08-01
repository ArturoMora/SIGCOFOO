namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CampoComentariosRechazoAceptoON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_BitacoraON", "ComentariosRechazo", c => c.String(unicode: false));
            AddColumn("CR.tab_BitacoraON", "ComentariosAcepto", c => c.String(unicode: false));
        }
        
        public override void Down()
        {
            DropColumn("CR.tab_BitacoraON", "ComentariosAcepto");
            DropColumn("CR.tab_BitacoraON", "ComentariosRechazo");
        }
    }
}
