namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Modificacion2 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("CH.tab_BecarioExterno", "EstadoFlujoId");
            AddForeignKey("CH.tab_BecarioExterno", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_BecarioExterno", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("CH.tab_BecarioExterno", new[] { "EstadoFlujoId" });
        }
    }
}
