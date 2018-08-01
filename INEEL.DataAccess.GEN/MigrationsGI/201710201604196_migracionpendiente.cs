namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migracionpendiente : DbMigration
    {
        public override void Up()
        {
            //AddColumn("PI.cat_TipoPropiedadIndustrial", "prioridadOrdenamiento", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            //DropColumn("PI.cat_TipoPropiedadIndustrial", "prioridadOrdenamiento");
        }
    }
}
