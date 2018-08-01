namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NuevoCampoRelacionTipoEvento : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "TipoEventoONId", c => c.Int());
            CreateIndex("CR.tab_OportunidadNegocios", "TipoEventoONId");
            AddForeignKey("CR.tab_OportunidadNegocios", "TipoEventoONId", "CR.tab_TiposEventos", "TipoEventoONId");
        }
        
        public override void Down()
        {
            DropForeignKey("CR.tab_OportunidadNegocios", "TipoEventoONId", "CR.tab_TiposEventos");
            DropIndex("CR.tab_OportunidadNegocios", new[] { "TipoEventoONId" });
            DropColumn("CR.tab_OportunidadNegocios", "TipoEventoONId");
        }
    }
}
