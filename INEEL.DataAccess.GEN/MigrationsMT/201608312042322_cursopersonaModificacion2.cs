namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cursopersonaModificacion2 : DbMigration
    {
        public override void Up()
        {
            CreateIndex("MT.CursosPersonal", "EstadoFlujoId");
            AddForeignKey("MT.CursosPersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("MT.CursosPersonal", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("MT.CursosPersonal", new[] { "EstadoFlujoId" });
        }
    }
}
