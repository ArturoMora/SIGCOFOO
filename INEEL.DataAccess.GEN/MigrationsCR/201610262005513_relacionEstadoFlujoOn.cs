namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class relacionEstadoFlujoOn : DbMigration
    {
        public override void Up()
        {
            AddColumn("CR.tab_OportunidadNegocios", "EstadoFlujoONId", c => c.Int());
            CreateIndex("CR.tab_OportunidadNegocios", "EstadoFlujoONId");
            AddForeignKey("CR.tab_OportunidadNegocios", "EstadoFlujoONId", "CR.tab_EstadoFlujoON", "EstadoFlujoONId");
            DropColumn("CR.tab_OportunidadNegocios", "EstadoOportunidad");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_OportunidadNegocios", "EstadoOportunidad", c => c.String());
            DropForeignKey("CR.tab_OportunidadNegocios", "EstadoFlujoONId", "CR.tab_EstadoFlujoON");
            DropIndex("CR.tab_OportunidadNegocios", new[] { "EstadoFlujoONId" });
            DropColumn("CR.tab_OportunidadNegocios", "EstadoFlujoONId");
        }
    }
}
