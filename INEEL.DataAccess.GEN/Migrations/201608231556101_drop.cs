namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class drop : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("GEN.PersonalProyecto", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            //DropIndex("GEN.PersonalProyecto", new[] { "EstadoFlujoId" });
            AddColumn("GEN.PersonalProyecto", "FechaValidacion", c => c.DateTime());
           AddColumn("GEN.PersonalProyecto", "EstadoFlujoId", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("GEN.PersonalProyecto", "EstadoFlujoId", c => c.Int(nullable: false));
            AlterColumn("GEN.PersonalProyecto", "FechaValidacion", c => c.DateTime());
            //CreateIndex("GEN.PersonalProyecto", "EstadoFlujoId");
            //AddForeignKey("GEN.PersonalProyecto", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
    }
}
