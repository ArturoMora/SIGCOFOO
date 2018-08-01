namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class add : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GEN.PersonalProyecto", "FechaValidacion", c => c.DateTime());
            AlterColumn("GEN.PersonalProyecto", "EstadoFlujoId", c => c.Int(nullable: false));
            CreateIndex("GEN.PersonalProyecto", "EstadoFlujoId");
            AddForeignKey("GEN.PersonalProyecto", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.PersonalProyecto", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GEN.PersonalProyecto", new[] { "EstadoFlujoId" });
            AlterColumn("GEN.PersonalProyecto", "EstadoFlujoId", c => c.String());
            AlterColumn("GEN.PersonalProyecto", "FechaValidacion", c => c.String());
        }
    }
}
