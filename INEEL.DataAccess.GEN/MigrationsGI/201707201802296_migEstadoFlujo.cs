namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migEstadoFlujo : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.cat_PropuestaConIdea", "EstadoFlujoId", c => c.Int(nullable: false));
            CreateIndex("GI.cat_PropuestaConIdea", "EstadoFlujoId");
            AddForeignKey("GI.cat_PropuestaConIdea", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.cat_PropuestaConIdea", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GI.cat_PropuestaConIdea", new[] { "EstadoFlujoId" });
            DropColumn("GI.cat_PropuestaConIdea", "EstadoFlujoId");
        }
    }
}
