namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estado : DbMigration
    {
        public override void Up()
        {
            //DropForeignKey("GEN.PersonalProyecto", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            //DropIndex("GEN.PersonalProyecto", new[] { "EstadoFlujoId" });
            //DropColumn("GEN.PersonalProyecto", "EstadoFlujoId");
        }
        
        public override void Down()
        {
            //AddColumn("GEN.PersonalProyecto", "EstadoFlujoId", c => c.Int(nullable: false));
            //CreateIndex("GEN.PersonalProyecto", "EstadoFlujoId");
            //AddForeignKey("GEN.PersonalProyecto", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
    }
}
