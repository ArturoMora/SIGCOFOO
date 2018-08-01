namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Modificacion : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CH.tab_BecarioExterno", "EstadoFlujoId", "CH.cat_EstadoFlujo");
            DropIndex("CH.tab_BecarioExterno", new[] { "EstadoFlujoId" });
        }
        
        public override void Down()
        {
            CreateIndex("CH.tab_BecarioExterno", "EstadoFlujoId");
            AddForeignKey("CH.tab_BecarioExterno", "EstadoFlujoId", "CH.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
    }
}
