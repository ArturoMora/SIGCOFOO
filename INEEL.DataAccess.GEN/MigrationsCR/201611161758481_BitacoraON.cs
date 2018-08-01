namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class BitacoraON : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_BitacoraON", "Investigador", c => c.String());
            AddColumn("CR.tab_BitacoraON", "Comentarios", c => c.String(unicode: false));
            DropColumn("CR.tab_BitacoraON", "InvestigadorId");
            DropColumn("CR.tab_BitacoraON", "ComentariosRechazo");
            DropColumn("CR.tab_BitacoraON", "ComentariosAcepto");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_BitacoraON", "ComentariosAcepto", c => c.String(unicode: false));
            AddColumn("CR.tab_BitacoraON", "ComentariosRechazo", c => c.String(unicode: false));
            AddColumn("CR.tab_BitacoraON", "InvestigadorId", c => c.String());
            DropColumn("CR.tab_BitacoraON", "Comentarios");
            DropColumn("CR.tab_BitacoraON", "Investigador");
        }
    }
}
