namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class pendiente : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GEN.cat_Categoria", "NivelInvestigador", c => c.String(maxLength: 5));
        }
        
        public override void Down()
        {
            //DropColumn("GEN.cat_Categoria", "NivelInvestigador");
        }
    }
}